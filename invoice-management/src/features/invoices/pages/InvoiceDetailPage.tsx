import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Invoice } from '@/types';
import '../styles/InvoiceDetailPage.css';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // TODO: Fetch invoice from Supabase
    setLoading(false);
  }, [id]);

  const handleSave = async () => {
    // TODO: Save invoice changes to Supabase
    setEditing(false);
  };

  const handleMarkAsPaid = async () => {
    // TODO: Mark invoice as paid
  };

  if (loading) return <div>Loading...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="invoice-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate('/invoices')}>
          ← Back
        </button>
        <h1>Invoice {invoice.invoice_number}</h1>
        <div className="detail-actions">
          <button className="action-btn secondary" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button className="action-btn" onClick={handleMarkAsPaid}>
            Mark as Paid
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h2>Invoice Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Invoice Number</label>
              <input type="text" value={invoice.invoice_number} disabled={!editing} />
            </div>
            <div className="form-group">
              <label>Invoice Date</label>
              <input type="date" value={invoice.invoice_date} disabled={!editing} />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={invoice.due_date} disabled={!editing} />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <input type="text" value={invoice.currency} disabled={!editing} />
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Amount Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Subtotal</label>
              <input type="number" value={invoice.subtotal} disabled={!editing} />
            </div>
            <div className="form-group">
              <label>CGST</label>
              <input type="number" value={invoice.cgst_amount || 0} disabled={!editing} />
            </div>
            <div className="form-group">
              <label>SGST</label>
              <input type="number" value={invoice.sgst_amount || 0} disabled={!editing} />
            </div>
            <div className="form-group">
              <label>IGST</label>
              <input type="number" value={invoice.igst_amount || 0} disabled={!editing} />
            </div>
            <div className="form-group">
              <label>Tax Total</label>
              <input type="number" value={invoice.tax_total} disabled={!editing} />
            </div>
            <div className="form-group">
              <label>Total Amount</label>
              <input type="number" value={invoice.total_amount} disabled={!editing} />
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Status & Payment</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Status</label>
              <select disabled={!editing}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="needs_review">Needs Review</option>
              </select>
            </div>
            <div className="form-group">
              <label>Payment Reference</label>
              <input type="text" value={invoice.payment_reference || ''} disabled={!editing} />
            </div>
          </div>
        </div>

        {editing && (
          <div className="detail-actions-bottom">
            <button className="action-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
