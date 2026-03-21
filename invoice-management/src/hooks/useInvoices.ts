import { useEffect, useState, useCallback, useRef } from "react";
import { invoiceApi } from "@/services/invoice.api";
import type { InvoiceWithVendor, InvoiceFilters } from "@/types";

export function useInvoices(filters: InvoiceFilters = {}) {
  const [invoices, setInvoices] = useState<InvoiceWithVendor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await invoiceApi.getAll(filtersRef.current);
      setInvoices(result.invoices);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch invoices");
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, total, loading, error, refetch: fetchInvoices };
}
