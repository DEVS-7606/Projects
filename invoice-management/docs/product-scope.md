# Product Scope — Invoice Management MVP

## What This Is

A focused invoice workflow tool for micro-SMEs.
Users forward supplier invoice emails, the system extracts data, and everything lives in one dashboard.

Not accounting software. Not an ERP. Not a GST filing tool.

## V1 Features

- Auth (signup, login, logout)
- User profile with unique forwarding email
- Vendor CRUD (name, GSTIN, email, phone, address, payment terms, notes, aliases)
- Invoice CRUD (manual creation + email ingestion)
- Invoice review/edit for OCR corrections
- Status tracking: unpaid, paid, overdue, needs_review
- Mark as paid with payment reference
- Duplicate detection and flagging
- Dashboard stats: total invoices, unpaid amount, overdue amount, paid this month
- File storage for invoice PDFs/images

## Out of V1 Scope

- WhatsApp integration
- Team/multi-user accounts
- Subscription billing
- Invoice line items table
- Payment gateway
- GST export/filing
- Advanced analytics
- Reminder scheduling

## Target Users

Micro-SMEs, small traders, service businesses, and agencies that receive invoices by email and currently track them manually.

## Success Criteria

- User can sign up, forward an invoice email, see it in the dashboard, edit it, and mark it paid
- Data is isolated per user (RLS)
- 5–10 beta users can use it without constant support
