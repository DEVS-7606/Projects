# Invoice Management System

A focused invoice workflow tool for micro-SMEs. Forward invoice emails, auto-extract data, and track unpaid/overdue invoices in one dashboard.

## 🎯 What This Is

- Email-to-invoice automation
- Invoice tracking dashboard
- Vendor management
- Status tracking (unpaid, paid, overdue)

## 🚫 What This Is NOT

- Full accounting software
- ERP system
- GST filing tool
- Team collaboration platform

## 🚀 Quick Start

### 1. Install & Setup (5 minutes)
```bash
npm install
cp .env.example .env
# Add your Supabase credentials to .env
```

### 2. Database Setup (10 minutes)
See `docs/backend-supabase-brief.txt` for SQL schema.

### 3. Run
```bash
npm run dev
```

Visit http://localhost:5173

## 📁 Project Structure

```
src/
├── shared/components/     # Reusable UI (Atomic Design)
│   ├── atoms/            # Buttons, inputs, badges
│   ├── molecules/        # Cards, form fields
│   ├── organisms/        # Tables, forms
│   └── templates/        # Page layouts
├── features/             # Feature modules
│   ├── auth/            # Login, signup
│   ├── dashboard/       # Dashboard page
│   ├── invoices/        # Invoice management
│   └── vendors/         # Vendor management
├── hooks/               # Custom React hooks
├── services/            # API/Supabase
├── utils/               # Utilities
├── types/               # TypeScript types
└── constants/           # App constants
```

## 🎨 Coding Standards

### Always Use Absolute Imports
```typescript
// ✅ Good
import { Button } from '@/shared/components/atoms/Button';
import { useAuth } from '@/hooks/useAuth';
import type { Invoice } from '@/types';

// ❌ Bad
import { Button } from '../../../shared/components/Button';
```

### Follow Atomic Design
```
Atoms → Molecules → Organisms → Templates → Pages
```

### Single Responsibility Principle
Each component/function does ONE thing.

### Keep It Clean
- Meaningful names
- Small functions (<20 lines)
- No magic numbers
- Proper error handling

## 📚 Key Documents

- **docs/project-plan.txt** - Product vision & scope
- **docs/backend-supabase-brief.txt** - Database schema
- **docs/frontend-ui-brief.txt** - UI requirements
- **CODING_STANDARDS.md** - Detailed coding standards

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (Auth, Database, Storage)
- **Routing**: React Router v7
- **Forms**: React Hook Form
- **Dates**: date-fns

## 📋 Development Workflow

### Creating Components
```typescript
// src/shared/components/atoms/Button/Button.tsx
import React from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Import Order
1. External dependencies
2. Types
3. Hooks
4. Components
5. Utils
6. Constants
7. Styles (last)

## ✅ Pre-Commit Checklist

- [ ] Absolute imports (`@/`)
- [ ] TypeScript types defined
- [ ] No console.logs
- [ ] Error handling
- [ ] Loading states

## 🐛 Common Issues

**Import errors**: Restart dev server
**Supabase errors**: Check `.env` file
**Build errors**: Run `npm run lint`

## 📞 Need Help?

1. Check `docs/` folder for detailed specs
2. Review `CODING_STANDARDS.md` for best practices
3. Look at existing components for examples

## 🎯 V1 Scope

**In Scope:**
- ✅ Email forwarding
- ✅ OCR extraction
- ✅ Invoice CRUD
- ✅ Vendor management
- ✅ Status tracking
- ✅ Duplicate detection

**Out of Scope:**
- ❌ WhatsApp integration
- ❌ Payment gateway
- ❌ Team accounts
- ❌ Billing/subscriptions
- ❌ GST filing

## 📈 Success Metrics

V1 is successful when:
- User can forward invoice email
- Invoice appears in dashboard
- User can edit and mark as paid
- 5-10 beta users can use it independently

---

**Built with ❤️ for micro-SMEs**
