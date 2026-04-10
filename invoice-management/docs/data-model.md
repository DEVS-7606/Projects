# Data Model — Invoice Management MVP

## Entities

### User (Profile)

| Field             | Type        | Notes                                   |
| ----------------- | ----------- | --------------------------------------- |
| id                | uuid        | References auth.users(id)               |
| email             | text        |                                         |
| username          | text        | Unique, required                        |
| business_name     | text        | Nullable                                |
| forwarding_email  | text        | Computed: invoices+username@yourapp.com |
| phone_e164        | text        | Nullable                                |
| timezone          | text        | Nullable                                |
| onboarding_status | text        | Nullable                                |
| created_at        | timestamptz |                                         |
| updated_at        | timestamptz |                                         |

### Vendor

| Field                      | Type        | Notes                             |
| -------------------------- | ----------- | --------------------------------- |
| id                         | uuid        | Auto-generated                    |
| user_id                    | uuid        | FK → profiles(id), cascade delete |
| name                       | text        | Required                          |
| gstin                      | text        | Nullable                          |
| email                      | text        | Nullable                          |
| phone                      | text        | Nullable                          |
| address                    | text        | Nullable                          |
| default_payment_terms_days | integer     | Nullable, >= 0                    |
| notes                      | text        | Nullable                          |
| aliases                    | text[]      | Nullable                          |
| is_active                  | boolean     | Default true                      |
| created_at                 | timestamptz |                                   |
| updated_at                 | timestamptz |                                   |

Unique constraint: (user_id, lower(name))

### Invoice

| Field                   | Type          | Notes                                          |
| ----------------------- | ------------- | ---------------------------------------------- |
| id                      | uuid          | Auto-generated                                 |
| user_id                 | uuid          | FK → profiles(id), cascade delete              |
| vendor_id               | uuid          | FK → vendors(id), nullable, set null on delete |
| invoice_number          | text          | Required                                       |
| invoice_date            | date          | Nullable                                       |
| due_date                | date          | Nullable                                       |
| currency                | text          | Default 'INR'                                  |
| subtotal                | numeric(12,2) | Nullable, >= 0                                 |
| tax_total               | numeric(12,2) | Nullable, >= 0                                 |
| total_amount            | numeric(12,2) | Required, >= 0                                 |
| cgst_amount             | numeric(12,2) | Nullable, >= 0                                 |
| sgst_amount             | numeric(12,2) | Nullable, >= 0                                 |
| igst_amount             | numeric(12,2) | Nullable, >= 0                                 |
| status                  | text          | unpaid, paid, overdue, needs_review            |
| paid_at                 | timestamptz   | Nullable                                       |
| payment_reference       | text          | Nullable                                       |
| source                  | text          | email, manual, api                             |
| source_message_id       | text          | Nullable                                       |
| file_url                | text          | Nullable                                       |
| raw_ocr_text            | text          | Nullable                                       |
| extracted_fields        | jsonb         | Default {}                                     |
| duplicate_status        | text          | none, suspected, confirmed, ignored            |
| duplicate_of_invoice_id | uuid          | Self-reference, nullable                       |
| created_at              | timestamptz   |                                                |
| updated_at              | timestamptz   |                                                |

### Invoice Item

| Field       | Type        | Notes                             |
| ----------- | ----------- | --------------------------------- |
| id          | uuid        | Auto-generated                    |
| invoice_id  | uuid        | FK → invoices(id), cascade delete |
| description | text        | Default ''                        |
| quantity    | numeric     | Default 1                         |
| unit_price  | numeric     | Default 0                         |
| amount      | numeric     | Default 0                         |
| created_at  | timestamptz |                                   |
| updated_at  | timestamptz |                                   |

## Relationships

- One user → many vendors
- One user → many invoices
- One vendor → many invoices
- One invoice → many invoice items
- One invoice may reference another as duplicate

## RLS

All tables have RLS enabled. Users can only select/insert/update/delete rows where user_id = auth.uid().

## Business Rules

- Invoice source values: email, manual, api (no whatsapp in v1)
- Duplicate detection does not block insertion — it flags for review
- Vendor names are unique per user (case-insensitive)
- Vendor matching order: GSTIN exact → name exact → name fuzzy/alias → create new
