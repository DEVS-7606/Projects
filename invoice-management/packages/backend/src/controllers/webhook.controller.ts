import type { NextFunction, Request, Response } from "express";
import { WebhookService } from "../services/webhook.service.js";

const webhookService = new WebhookService();

export class WebhookController {
  /**
   * POST /api/webhook/email
   *
   * Called by SendGrid Inbound Parse when someone sends an email
   * to your domain. The payload is multipart/form-data with fields
   * like: to, from, subject, text, html, attachments, attachment1, etc.
   *
   * No auth middleware — SendGrid calls this directly.
   */
  async handleInboundEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { to, from, subject, text } = req.body;

      console.log("[Webhook] Inbound email received:", {
        to,
        from,
        subject: subject?.slice(0, 80),
      });

      // SendGrid sends attachment count as a string
      const attachmentCount = parseInt(req.body.attachments || "0", 10);

      // Collect attachment files from multer
      const files = (req.files as Express.Multer.File[]) || [];

      const result = await webhookService.processInboundEmail({
        to: to || "",
        from: from || "",
        subject: subject || "",
        text: text || "",
        attachmentCount,
        files,
      });

      // Always respond 200 to SendGrid — otherwise it retries
      res.status(200).json({
        message: "Email processed",
        invoiceId: result?.invoiceId || null,
        status: result?.status || "no_action",
      });
    } catch (error) {
      // Log the error but still return 200 to SendGrid to prevent retries
      console.error("[Webhook] Error processing inbound email:", error);
      res
        .status(200)
        .json({ message: "Error processing email", status: "error" });
    }
  }
}
