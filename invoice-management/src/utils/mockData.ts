export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue' | 'needs_review';
export type InvoiceSource = 'email' | 'manual';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  vendorId: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxTotal: number;
  currency: string;
  status: InvoiceStatus;
  source: InvoiceSource;
  paymentReference?: string;
  paidDate?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  isDuplicate?: boolean;
  duplicateOf?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentTerms: number;
  notes: string;
  status: 'active' | 'inactive';
  outstandingAmount: number;
  invoiceCount: number;
  createdAt: string;
  updatedAt: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    vendor: 'Tech Solutions Pvt Ltd',
    vendorId: '1',
    invoiceDate: '2026-01-15',
    dueDate: '2026-02-15',
    amount: 45000,
    subtotal: 38136,
    cgst: 3432,
    sgst: 3432,
    igst: 0,
    taxTotal: 6864,
    currency: 'INR',
    status: 'paid',
    source: 'email',
    paymentReference: 'TXN-20240215-001',
    paidDate: '2026-02-14',
    paymentMethod: 'NEFT',
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-02-14T14:20:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    vendor: 'Office Supplies Co',
    vendorId: '2',
    invoiceDate: '2026-01-18',
    dueDate: '2026-02-18',
    amount: 12500,
    subtotal: 10593,
    cgst: 954,
    sgst: 954,
    igst: 0,
    taxTotal: 1907,
    currency: 'INR',
    status: 'unpaid',
    source: 'manual',
    createdAt: '2026-01-18T09:00:00Z',
    updatedAt: '2026-01-18T09:00:00Z',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    vendor: 'Cloud Services Ltd',
    vendorId: '3',
    invoiceDate: '2026-01-20',
    dueDate: '2026-01-30',
    amount: 28000,
    subtotal: 23729,
    cgst: 2136,
    sgst: 2136,
    igst: 0,
    taxTotal: 4271,
    currency: 'INR',
    status: 'overdue',
    source: 'email',
    createdAt: '2026-01-20T11:45:00Z',
    updatedAt: '2026-01-20T11:45:00Z',
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    vendor: 'Design Studio India',
    vendorId: '4',
    invoiceDate: '2026-01-22',
    dueDate: '2026-02-22',
    amount: 35000,
    subtotal: 29661,
    cgst: 2669,
    sgst: 2669,
    igst: 0,
    taxTotal: 5339,
    currency: 'INR',
    status: 'paid',
    source: 'email',
    paymentReference: 'TXN-20240222-002',
    paidDate: '2026-02-20',
    paymentMethod: 'UPI',
    createdAt: '2026-01-22T08:15:00Z',
    updatedAt: '2026-02-20T16:00:00Z',
  },
  {
    id: '5',
    invoiceNumber: 'INV-005',
    vendor: 'Marketing Agency',
    vendorId: '5',
    invoiceDate: '2026-01-25',
    dueDate: '2026-02-25',
    amount: 55000,
    subtotal: 46610,
    cgst: 4195,
    sgst: 4195,
    igst: 0,
    taxTotal: 8390,
    currency: 'INR',
    status: 'unpaid',
    source: 'manual',
    createdAt: '2026-01-25T13:30:00Z',
    updatedAt: '2026-01-25T13:30:00Z',
  },
];

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Tech Solutions Pvt Ltd',
    email: 'contact@techsolutions.com',
    phone: '+91 98765 43210',
    gstin: '29ABCDE1234F1Z5',
    address: '123 Tech Park, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    paymentTerms: 30,
    notes: 'Preferred vendor for IT services',
    status: 'active',
    outstandingAmount: 12500,
    invoiceCount: 8,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Office Supplies Co',
    email: 'sales@officesupplies.com',
    phone: '+91 98765 43211',
    gstin: '27FGHIJ5678K2L6',
    address: '456 Supply Street, Andheri',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    paymentTerms: 15,
    notes: 'Quick delivery, good prices',
    status: 'active',
    outstandingAmount: 0,
    invoiceCount: 12,
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2026-02-28T10:00:00Z',
  },
  {
    id: '3',
    name: 'Cloud Services Ltd',
    email: 'billing@cloudservices.com',
    phone: '+91 98765 43212',
    gstin: '09MNOPQ9012R3S7',
    address: '789 Cloud Tower, Cyber City',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122002',
    paymentTerms: 30,
    notes: 'Monthly cloud hosting services',
    status: 'active',
    outstandingAmount: 28000,
    invoiceCount: 15,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2026-03-05T10:00:00Z',
  },
  {
    id: '4',
    name: 'Design Studio India',
    email: 'hello@designstudio.in',
    phone: '+91 98765 43213',
    gstin: '19TUVWX3456Y4Z8',
    address: '321 Creative Hub, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    paymentTerms: 45,
    notes: 'Excellent design work, reliable',
    status: 'active',
    outstandingAmount: 0,
    invoiceCount: 6,
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z',
  },
  {
    id: '5',
    name: 'Marketing Agency',
    email: 'info@marketingagency.com',
    phone: '+91 98765 43214',
    gstin: '07ABCDE7890F5G9',
    address: '654 Marketing Plaza, Bandra',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    paymentTerms: 30,
    notes: 'Digital marketing campaigns',
    status: 'active',
    outstandingAmount: 55000,
    invoiceCount: 4,
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2026-03-07T10:00:00Z',
  },
  {
    id: '6',
    name: 'Freight Corp',
    email: 'logistics@freightcorp.com',
    phone: '+91 98765 43215',
    gstin: '29HIJKL1234M6N0',
    address: '987 Logistics Park, Peenya',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560058',
    paymentTerms: 15,
    notes: 'Shipping and logistics partner',
    status: 'inactive',
    outstandingAmount: 0,
    invoiceCount: 3,
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2025-12-20T10:00:00Z',
  },
];

export const forwardingEmail = 'invoices@yourdomain.com';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
