import { useEffect, useState, useCallback } from 'react';
import { invoiceApi } from '@/services/invoice.api';
import type { InvoiceWithVendor } from '@/types';

export function useInvoiceDetail(id: string | undefined) {
  const [invoice, setInvoice] = useState<InvoiceWithVendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await invoiceApi.getById(id);
      setInvoice(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoice');
      console.error('Error fetching invoice:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  return { invoice, loading, error, refetch: fetchInvoice };
}
