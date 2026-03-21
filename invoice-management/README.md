# Invoice Management System

A focused invoice workflow tool for micro-SMEs. Track unpaid/overdue invoices, manage vendors, and automate invoice data extraction.

## Tech Stack

- Frontend: React 19 + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: Supabase (PostgreSQL + Auth + RLS)
- Routing: React Router v7

## Quick Start

```bash
npm install
cp .env.example .env
# Add your Supabase credentials to .env
npm run dev
```

Visit http://localhost:5173

## Project Structure

```
src/
├── features/          # Feature modules (auth, dashboard, invoices, vendors)
├── shared/components/ # Atomic Design components (atoms → molecules → organisms → templates)
├── hooks/             # Custom React hooks
├── services/          # API/Supabase calls
├── utils/             # Utilities
└── types/             # TypeScript types

packages/
├── backend/           # Express API server
└── shared/            # Shared types between frontend and backend
```

## Environment Variables

```bash
# Frontend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=/api

# Backend (packages/backend/.env)
PORT=3002
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

## Database

Tables: `profiles`, `vendors`, `invoices` — all with Row Level Security enabled.

Schema SQL is in `docs/backend-supabase-brief.txt`. Run it in the Supabase SQL Editor to set up your database.

Demo login: **demobuilders@gmail.com**

## Useful Commands

```bash
npm run dev              # Start frontend dev server
npm run build            # Build frontend
npm run build:backend    # Build backend
npm run lint             # Lint
npm run typecheck:all    # Type check everything
```

## V1 Scope

In scope: invoice CRUD, vendor management, status tracking, duplicate detection, email forwarding, OCR extraction.

Out of scope: payment gateway, team accounts, GST filing, WhatsApp integration.
