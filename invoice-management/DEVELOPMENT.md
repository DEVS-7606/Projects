# Development Guide

## Coding Standards

### Architecture Layers

```
Presentation (React pages/components)
    ↓
Application (hooks, state)
    ↓
Domain (business logic, validators)
    ↓
Data Access (services, API calls)
    ↓
Infrastructure (Supabase, external services)
```

Each layer only depends on the layer below it — never skip layers or go upward.

### Key Rules

- Use absolute imports (`@/`) — never relative paths like `../../../`
- Components follow Atomic Design: Atoms → Molecules → Organisms → Templates → Pages
- Functions do one thing, stay under 20 lines
- No business logic in components — extract to hooks
- No `console.log` in production code
- TypeScript types required for all props and functions

### Import Order

```typescript
// 1. External deps
import React, { useState } from "react";

// 2. Types
import type { Invoice } from "@/types";

// 3. Hooks
import { useAuth } from "@/hooks/useAuth";

// 4. Components
import { Button } from "@/shared/components/atoms/Button";

// 5. Utils / Constants
import { formatCurrency } from "@/utils/formatters";

// 6. Styles (last)
import "./InvoicesPage.css";
```

### Naming

- Components: `PascalCase` — `InvoiceCard.tsx`
- Hooks: `camelCase` with `use` prefix — `useInvoices.ts`
- Utils: `camelCase` — `formatters.ts`
- Constants: `UPPER_SNAKE_CASE` — `MAX_INVOICES`
- Booleans: `is/has/should` prefix — `isLoading`, `hasError`

---

## Supabase Integration

### Auth

```typescript
import { supabase } from "@/services/supabase";

// Sign up
await supabase.auth.signUp({
  email,
  password,
  options: { data: { username } },
});

// Sign in
await supabase.auth.signInWithPassword({ email, password });

// Sign out
await supabase.auth.signOut();
```

### useAuth Hook

```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, signOut: () => supabase.auth.signOut() };
}
```

### Fetching Data

```typescript
// Invoices with vendor info
const { data, error } = await supabase
  .from("invoices")
  .select("*, vendor:vendors(*)")
  .order("created_at", { ascending: false });

// Vendors
const { data, error } = await supabase
  .from("vendors")
  .select("*")
  .eq("is_active", true)
  .order("name");
```

### Common Errors

| Error                     | Fix                                                             |
| ------------------------- | --------------------------------------------------------------- |
| `Invalid API key`         | Check `.env`, restart dev server                                |
| `RLS policy violation`    | Ensure user is authenticated; `user_id` must match `auth.uid()` |
| `relation does not exist` | Table names are `profiles`, `vendors`, `invoices` (plural)      |
| `JWT expired`             | User needs to sign in again                                     |

---

## Pre-Commit Checklist

- [ ] Absolute imports (`@/`)
- [ ] TypeScript types defined
- [ ] No `console.log`
- [ ] Error handling in place
- [ ] Loading states handled
