# Architecture — Invoice Management MVP

## Stack

- Frontend: React + TypeScript + Vite
- Backend: Express (TypeScript), deployed on Vercel
- Database/Auth/Storage: Supabase (Postgres + RLS + Auth + Storage)
- Styling: Tailwind CSS

## Frontend Structure

Pages (all behind auth except login/signup):

- /login
- /signup
- /dashboard
- /invoices
- /invoices/:id
- /vendors
- /settings

No forgot-password page in v1.

## Backend Structure

Express API at /api with routes:

- /api/auth — signup, login, session
- /api/invoices — CRUD, filters, dashboard stats
- /api/vendors — CRUD

Middleware: auth (token verification), validation (Zod), error handler.

Pattern: routes → controllers → services → repositories → Supabase.

## Email Ingestion Flow (v1 target)

1. User forwards email to invoices+username@yourapp.com
2. Webhook receives inbound email
3. Parse recipient → find profile
4. Extract attachment → upload to Supabase Storage
5. Run OCR → extract fields
6. Match or create vendor
7. Create invoice record (status = needs_review if low confidence)
8. Run duplicate check → set duplicate_status if needed

## Duplicate Detection

Checks in order:

1. Same user + same vendor + same invoice_number
2. Same user + same vendor + same total_amount + same invoice_date
3. Same user + same invoice_number + same total_amount

Never blocks insertion. Sets duplicate_status = suspected and links duplicate_of_invoice_id.

## Storage

Supabase Storage bucket for invoice files (PDF/images).
Path pattern: {user_id}/invoices/{filename}
Users can only access their own files.
