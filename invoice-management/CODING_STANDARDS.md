# Coding Standards & Best Practices

This document outlines the coding standards for the Invoice Management System, based on Clean Code principles by Uncle Bob, Single Responsibility Principle (SRP), and Atomic Design by Brad Frost.

## Table of Contents
1. [Clean Code Principles](#clean-code-principles)
2. [Single Responsibility Principle](#single-responsibility-principle)
3. [Atomic Design](#atomic-design)
4. [Import Conventions](#import-conventions)
5. [File Organization](#file-organization)
6. [Naming Conventions](#naming-conventions)
7. [Component Guidelines](#component-guidelines)

---

## Clean Code Principles (Uncle Bob)

### 1. Meaningful Names
```typescript
// ❌ Bad
const d = new Date();
const x = users.filter(u => u.a);

// ✅ Good
const currentDate = new Date();
const activeUsers = users.filter(user => user.isActive);
```

### 2. Functions Should Do One Thing
```typescript
// ❌ Bad - Does multiple things
function processInvoiceAndSendEmail(invoice: Invoice) {
  // Validate invoice
  if (!invoice.total) return;
  
  // Save to database
  saveInvoice(invoice);
  
  // Send email
  sendEmail(invoice.vendor.email, 'Invoice created');
}

// ✅ Good - Single responsibility
function validateInvoice(invoice: Invoice): boolean {
  return invoice.total > 0;
}

function saveInvoice(invoice: Invoice): Promise<void> {
  return supabase.from('invoices').insert(invoice);
}

function sendInvoiceNotification(email: string): Promise<void> {
  return emailService.send(email, 'Invoice created');
}
```

### 3. Small Functions
- Keep functions under 20 lines
- Extract complex logic into separate functions
- Use descriptive names

```typescript
// ✅ Good
function calculateInvoiceTotal(invoice: Invoice): number {
  const subtotal = calculateSubtotal(invoice.items);
  const tax = calculateTax(subtotal, invoice.taxRate);
  return subtotal + tax;
}

function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateTax(amount: number, rate: number): number {
  return amount * (rate / 100);
}
```

### 4. Comments Should Explain Why, Not What
```typescript
// ❌ Bad - Explains what (obvious from code)
// Loop through invoices
invoices.forEach(invoice => {
  // Calculate total
  const total = invoice.subtotal + invoice.tax;
});

// ✅ Good - Explains why
// We need to recalculate totals because tax rates changed retroactively
invoices.forEach(invoice => {
  const total = calculateTotalWithNewTaxRate(invoice);
});
```

### 5. Error Handling
```typescript
// ❌ Bad
try {
  const invoice = await fetchInvoice(id);
  return invoice;
} catch (e) {
  console.log(e);
}

// ✅ Good
try {
  const invoice = await fetchInvoice(id);
  return invoice;
} catch (error) {
  logger.error('Failed to fetch invoice', { id, error });
  throw new InvoiceNotFoundError(`Invoice ${id} not found`);
}
```

---

## Single Responsibility Principle (SRP)

### Component Level
Each component should have ONE reason to change.

```typescript
// ❌ Bad - Multiple responsibilities
function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const [editing, setEditing] = useState(false);
  
  // Handles display, editing, validation, and API calls
  const handleSave = async () => {
    if (!invoice.total) return;
    await supabase.from('invoices').update(invoice);
    setEditing(false);
  };
  
  return (
    <div>
      {editing ? <InvoiceForm /> : <InvoiceDisplay />}
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

// ✅ Good - Single responsibility per component
function InvoiceCard({ invoice, onEdit }: InvoiceCardProps) {
  return (
    <div className="invoice-card">
      <InvoiceDisplay invoice={invoice} />
      <Button onClick={() => onEdit(invoice.id)}>Edit</Button>
    </div>
  );
}

function InvoiceDisplay({ invoice }: { invoice: Invoice }) {
  return (
    <div>
      <h3>{invoice.number}</h3>
      <p>{formatCurrency(invoice.total)}</p>
    </div>
  );
}
```

### Hook Level
```typescript
// ❌ Bad - Does too much
function useInvoice(id: string) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetches invoice, vendors, and handles updates
  useEffect(() => {
    fetchInvoice(id);
    fetchVendors();
  }, [id]);
  
  return { invoice, vendors, loading, updateInvoice, deleteInvoice };
}

// ✅ Good - Separate concerns
function useInvoice(id: string) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchInvoice(id).then(setInvoice).finally(() => setLoading(false));
  }, [id]);
  
  return { invoice, loading };
}

function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  
  useEffect(() => {
    fetchVendors().then(setVendors);
  }, []);
  
  return { vendors };
}
```

---

## Atomic Design (Brad Frost)

### Hierarchy

```
Atoms → Molecules → Organisms → Templates → Pages
```

### 1. Atoms (Basic Building Blocks)
Smallest components that can't be broken down further.

**Location**: `src/shared/components/atoms/`

```typescript
// Button.tsx
export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// Input.tsx
export function Input({ label, value, onChange, type = 'text' }: InputProps) {
  return (
    <div className="input-wrapper">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
}

// Badge.tsx
export function Badge({ children, color }: BadgeProps) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}
```

### 2. Molecules (Simple Component Groups)
Combinations of atoms that form simple, functional units.

**Location**: `src/shared/components/molecules/`

```typescript
// FormField.tsx
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { ErrorMessage } from '@/shared/components/atoms/ErrorMessage';

export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  return (
    <div className="form-field">
      <Label>{label}</Label>
      <Input {...inputProps} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
}

// SearchBar.tsx
import { Input } from '@/shared/components/atoms/Input';
import { Button } from '@/shared/components/atoms/Button';

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  
  return (
    <div className="search-bar">
      <Input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Button onClick={() => onSearch(query)}>Search</Button>
    </div>
  );
}
```

### 3. Organisms (Complex Components)
Complex UI components composed of molecules and/or atoms.

**Location**: `src/shared/components/organisms/`

```typescript
// InvoiceTable.tsx
import { DataTable } from '@/shared/components/molecules/DataTable';
import { StatusBadge } from '@/shared/components/atoms/StatusBadge';
import { Button } from '@/shared/components/atoms/Button';

export function InvoiceTable({ invoices, onEdit, onDelete }: InvoiceTableProps) {
  const columns = [
    { key: 'number', label: 'Invoice #' },
    { key: 'vendor', label: 'Vendor' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => <StatusBadge status={status} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, invoice) => (
        <>
          <Button onClick={() => onEdit(invoice.id)}>Edit</Button>
          <Button onClick={() => onDelete(invoice.id)}>Delete</Button>
        </>
      )
    }
  ];
  
  return <DataTable columns={columns} data={invoices} />;
}
```

### 4. Templates (Page Layouts)
Page-level layouts that define structure.

**Location**: `src/shared/components/templates/`

```typescript
// DashboardTemplate.tsx
import { Header } from '@/shared/components/organisms/Header';
import { Sidebar } from '@/shared/components/organisms/Sidebar';
import { Footer } from '@/shared/components/organisms/Footer';

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <div className="dashboard-template">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
```

### 5. Pages (Specific Instances)
Specific instances of templates with real content.

**Location**: `src/features/[feature]/pages/`

```typescript
// InvoicesPage.tsx
import { DashboardTemplate } from '@/shared/components/templates/DashboardTemplate';
import { InvoiceTable } from '@/shared/components/organisms/InvoiceTable';
import { PageHeader } from '@/shared/components/molecules/PageHeader';

export function InvoicesPage() {
  const { invoices } = useInvoices();
  
  return (
    <DashboardTemplate>
      <PageHeader title="Invoices" />
      <InvoiceTable invoices={invoices} />
    </DashboardTemplate>
  );
}
```

---

## Import Conventions

### Always Use Absolute Paths

```typescript
// ❌ Bad - Relative paths
import { Button } from '../../../shared/components/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { Invoice } from '../../../types';

// ✅ Good - Absolute paths
import { Button } from '@/shared/components/atoms/Button';
import { useAuth } from '@/hooks/useAuth';
import { Invoice } from '@/types';
```

### Import Order
```typescript
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Absolute imports - Types
import type { Invoice, Vendor } from '@/types';

// 3. Absolute imports - Hooks
import { useAuth } from '@/hooks/useAuth';
import { useInvoices } from '@/hooks/useInvoices';

// 4. Absolute imports - Components
import { Button } from '@/shared/components/atoms/Button';
import { InvoiceTable } from '@/shared/components/organisms/InvoiceTable';

// 5. Absolute imports - Utils
import { formatCurrency } from '@/utils/formatters';
import { validateInvoice } from '@/utils/validators';

// 6. Absolute imports - Constants
import { INVOICE_STATUS } from '@/constants';

// 7. Styles (always last)
import './InvoicesPage.css';
```

---

## File Organization

### Atomic Design Structure
```
src/
├── shared/
│   └── components/
│       ├── atoms/           # Basic building blocks
│       │   ├── Button/
│       │   ├── Input/
│       │   ├── Badge/
│       │   └── Label/
│       ├── molecules/       # Simple combinations
│       │   ├── FormField/
│       │   ├── SearchBar/
│       │   └── Card/
│       ├── organisms/       # Complex components
│       │   ├── Header/
│       │   ├── Sidebar/
│       │   ├── InvoiceTable/
│       │   └── VendorForm/
│       └── templates/       # Page layouts
│           ├── DashboardTemplate/
│           └── AuthTemplate/
├── features/
│   └── [feature]/
│       ├── pages/          # Page components
│       ├── components/     # Feature-specific components
│       ├── hooks/          # Feature-specific hooks
│       └── styles/         # Feature-specific styles
```

---

## Naming Conventions

### Files
- **Components**: PascalCase - `InvoiceCard.tsx`
- **Hooks**: camelCase with 'use' prefix - `useInvoices.ts`
- **Utils**: camelCase - `formatters.ts`
- **Types**: PascalCase - `Invoice.ts` or `index.ts`
- **Constants**: camelCase - `statusColors.ts`
- **Styles**: Match component name - `InvoiceCard.css`

### Variables & Functions
```typescript
// Variables: camelCase
const invoiceTotal = 1000;
const isActive = true;

// Functions: camelCase, verb-first
function calculateTotal() {}
function fetchInvoices() {}
function handleSubmit() {}

// Boolean variables: is/has/should prefix
const isLoading = true;
const hasError = false;
const shouldRender = true;

// Constants: UPPER_SNAKE_CASE
const MAX_INVOICES = 100;
const API_BASE_URL = 'https://api.example.com';

// Components: PascalCase
function InvoiceCard() {}
function UserProfile() {}
```

---

## Component Guidelines

### 1. Keep Components Small
- Max 150 lines per component
- Extract complex logic into hooks
- Split large components into smaller ones

### 2. Props Interface
```typescript
// ✅ Good - Clear, typed props
interface InvoiceCardProps {
  invoice: Invoice;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function InvoiceCard({ 
  invoice, 
  onEdit, 
  onDelete, 
  isLoading = false 
}: InvoiceCardProps) {
  // Component logic
}
```

### 3. Composition Over Inheritance
```typescript
// ✅ Good - Use composition
function InvoiceList({ invoices }: InvoiceListProps) {
  return (
    <div>
      {invoices.map(invoice => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
}
```

### 4. Custom Hooks for Logic
```typescript
// ✅ Good - Extract logic into hooks
function useInvoiceForm(initialInvoice?: Invoice) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    // Validation logic
  };
  
  const handleSubmit = async () => {
    // Submit logic
  };
  
  return { invoice, errors, validate, handleSubmit };
}
```

---

## Code Review Checklist

- [ ] Functions do one thing only (SRP)
- [ ] Names are meaningful and descriptive
- [ ] No magic numbers or strings (use constants)
- [ ] Components follow Atomic Design hierarchy
- [ ] All imports use absolute paths (@/)
- [ ] Proper error handling
- [ ] No console.logs in production code
- [ ] TypeScript types are properly defined
- [ ] Comments explain "why", not "what"
- [ ] Functions are small (<20 lines)
- [ ] No duplicate code (DRY principle)

---

## Resources

- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [React Best Practices](https://react.dev/learn)
