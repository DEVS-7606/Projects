# Execution Plan — Dealers Invoice v1 Completion

## Status Legend

- [ ] Not started
- [~] In progress
- [x] Done

---

## Already Complete ✅

- [x] Auth (login, signup, protected routes, session management)
- [x] Dashboard with stat cards (unpaid, overdue, paid this month, total)
- [x] Invoice list with search, filters, pagination
- [x] Add/edit invoice modal with line items and GST tax calculation
- [x] Invoice detail view (edit, delete, mark as paid)
- [x] Vendor directory with full CRUD
- [x] Payment status tracking (Unpaid / Paid / Overdue / Needs Review)
- [x] Forwarding email displayed in dashboard with copy button

---

## Phase 3 — Email Integration (~10 hrs)

### Step 1: Understand the concept (30 min)

- [ ] Ask AI: "Explain how SendGrid Inbound Parse works end-to-end"
- [ ] Understand the flow: email arrives → SendGrid POSTs JSON to your URL → you parse it

### Step 2: Set up SendGrid + MX records (2 hrs)

- [ ] Create SendGrid account
- [ ] Configure Inbound Parse webhook URL
- [ ] Point domain MX records to `mx.sendgrid.net`
- [ ] Build minimal Express endpoint that logs raw SendGrid payload
- [ ] Test with a real forwarded email using ngrok locally

### Step 3: Build the webhook endpoint (4 hrs)

- [ ] Parse `to` field to extract username → look up user in Supabase
- [ ] Extract base64 PDF attachments from the payload
- [ ] Upload PDF to Supabase Storage
- [ ] Create stub invoice record with `source: "email"` and `file_url`

### Step 4: Confirmation email (2 hrs)

- [ ] After processing, send user an email: "Invoice received and being processed"
- [ ] Include link back to dashboard

---

## Phase 4 — OCR & Auto-Extraction (~11 hrs)

### Step 1: Understand Google Vision API (30 min)

- [ ] Ask AI: "Show me a minimal Node.js example calling Google Vision API on a PDF"
- [ ] Run it locally with a sample invoice PDF, see the raw output

### Step 2: Set up credentials (1 hr)

- [ ] Create Google Cloud project
- [ ] Enable Vision API
- [ ] Download service account JSON
- [ ] Store credentials securely (env vars / Vercel secrets)

### Step 3: Build the OCR service (5 hrs)

- [ ] Function: file URL → Vision API → returns raw text
- [ ] Regex/rules extractor for: vendor name, invoice number, amount, date, due date
- [ ] Wire into webhook: email arrives → OCR → populate invoice fields
- [ ] Set `status: "needs_review"` if confidence is low
- [ ] Allow user to edit/fix extracted fields (already supported in edit modal)

### Step 4: Duplicate detection (2 hrs)

- [ ] Implement matching logic:
  - Same user + same vendor + same invoice_number
  - Same user + same vendor + same total_amount + same invoice_date
  - Same user + same invoice_number + same total_amount
- [ ] Set `duplicate_status: "suspected"` and link `duplicate_of_invoice_id`
- [ ] UI warning already exists — just needs the backend logic

---

## Phase 5 — Polish & Remaining UI (~4 hrs)

- [ ] Export button on invoices page (CSV download)
- [ ] Send Reminder button (send email to vendor)
- [ ] View / Download PDF (from Supabase Storage URL)
- [ ] Settings page (update business name, username, timezone)
- [ ] Confirmation email after OCR: "Invoice #123 added!" with dashboard link

---

## How to Use AI While Building

Pattern to follow for every task:

1. Ask AI to build a small focused piece
2. Read it — ask "explain this part" for anything unclear
3. Modify it slightly yourself (change a variable, add a log)
4. Move to the next piece

Good questions to ask while building:

- "What is multipart/form-data and why does SendGrid use it?"
- "Why do we need to decode base64 here?"
- "What does this Supabase Storage upload call actually do?"
- "Explain the duplicate detection query you wrote"

---

## Weekly Schedule

| Week   | Focus                                                    | Est. Hours |
| ------ | -------------------------------------------------------- | ---------- |
| Week 1 | SendGrid setup + webhook endpoint                        | 6 hrs      |
| Week 2 | OCR integration + field extraction                       | 6 hrs      |
| Week 3 | Wire it all together + duplicate detection               | 5 hrs      |
| Week 4 | Polish — export, reminders, settings, confirmation email | 4 hrs      |

Total remaining: ~21 hrs

---

## One Rule

Build v1 ugly. Get it working first, understand it second, clean it up last.
