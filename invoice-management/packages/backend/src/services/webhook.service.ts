import { supabase } from "../config/supabase.js";

interface InboundEmailPayload {
  to: string;
  from: string;
  subject: string;
  text: string;
  attachmentCount: number;
  files: Express.Multer.File[];
}

interface ProcessResult {
  invoiceId: string;
  status: "created" | "no_user" | "no_attachment";
}

export class WebhookService {
  /**
   * Main entry point for processing an inbound email from SendGrid.
   *
   * Flow:
   * 1. Parse the "to" address to find which user this email belongs to
   * 2. Upload any PDF attachments to Supabase Storage
   * 3. Create a stub invoice record with source = "email"
   *
   * OCR extraction will be added in Phase 4.
   */
  async processInboundEmail(
    payload: InboundEmailPayload,
  ): Promise<ProcessResult | null> {
    // Step 1: Find the user from the "to" address
    const userId = await this.resolveUserFromEmail(payload.to);
    if (!userId) {
      console.warn("[Webhook] No user found for email:", payload.to);
      return { invoiceId: "", status: "no_user" };
    }

    // Step 2: Find PDF attachments
    const pdfFiles = payload.files.filter(
      (f) =>
        f.mimetype === "application/pdf" ||
        f.originalname?.toLowerCase().endsWith(".pdf"),
    );

    if (pdfFiles.length === 0) {
      console.warn("[Webhook] No PDF attachments found in email");
      return { invoiceId: "", status: "no_attachment" };
    }

    // Step 3: Process each PDF attachment (usually just one)
    // For v1, we process the first PDF only
    const file = pdfFiles[0];
    const fileUrl = await this.uploadToStorage(userId, file);

    // Step 4: Create a stub invoice record
    const invoice = await this.createStubInvoice({
      userId,
      fileUrl,
      senderEmail: this.extractEmailAddress(payload.from),
      subject: payload.subject,
    });

    console.log("[Webhook] Invoice created:", invoice.id);

    return { invoiceId: invoice.id, status: "created" };
  }

  /**
   * Parse the "to" field to extract the user identifier.
   *
   * The forwarding email format is: invoices-{userId8chars}@delerinvoice.co.in
   * The "to" field from SendGrid might look like:
   *   "User Name <invoices-abc12345@delerinvoice.co.in>"
   *   or just "invoices-abc12345@delerinvoice.co.in"
   */
  private async resolveUserFromEmail(toField: string): Promise<string | null> {
    // Extract the email address from the "to" field
    const emailMatch = toField.match(/invoices-([a-f0-9]+)@/i);

    if (!emailMatch) {
      console.warn("[Webhook] Could not parse user ID from:", toField);
      return null;
    }

    const userIdPrefix = emailMatch[1];

    // Look up the user whose ID starts with this prefix
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id")
      .like("id", `${userIdPrefix}%`);

    if (error || !profiles || profiles.length === 0) {
      console.warn("[Webhook] No profile found for prefix:", userIdPrefix);
      return null;
    }

    // If multiple matches (unlikely with 8 chars), take the first
    return profiles[0].id;
  }

  /**
   * Upload a PDF file to Supabase Storage.
   * Path pattern: {user_id}/invoices/{timestamp}_{filename}
   */
  private async uploadToStorage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const timestamp = Date.now();
    const safeName = (file.originalname || "invoice.pdf").replace(
      /[^a-zA-Z0-9._-]/g,
      "_",
    );
    const storagePath = `${userId}/invoices/${timestamp}_${safeName}`;

    const { error } = await supabase.storage
      .from("invoice-files")
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype || "application/pdf",
        upsert: false,
      });

    if (error) {
      console.error("[Webhook] Storage upload failed:", error.message);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("invoice-files")
      .getPublicUrl(storagePath);

    return urlData.publicUrl;
  }

  /**
   * Create a stub invoice record from an email.
   * Status is "needs_review" because OCR hasn't run yet.
   * The invoice_number is a placeholder until OCR extracts the real one.
   */
  private async createStubInvoice(params: {
    userId: string;
    fileUrl: string;
    senderEmail: string;
    subject: string;
  }): Promise<{ id: string }> {
    const { userId, fileUrl, senderEmail, subject } = params;

    // Generate a temporary invoice number
    const tempNumber = `EMAIL-${Date.now().toString(36).toUpperCase()}`;

    const { data, error } = await supabase
      .from("invoices")
      .insert({
        user_id: userId,
        invoice_number: tempNumber,
        total_amount: 0,
        status: "needs_review",
        source: "email",
        file_url: fileUrl,
        extracted_fields: {
          sender_email: senderEmail,
          email_subject: subject,
          processing_status: "pending_ocr",
        },
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Failed to create invoice: ${error.message}`);
    }

    return data;
  }

  /**
   * Extract a plain email address from a "Name <email>" format string.
   */
  private extractEmailAddress(fromField: string): string {
    const match = fromField.match(/<([^>]+)>/);
    return match ? match[1] : fromField.trim();
  }
}
