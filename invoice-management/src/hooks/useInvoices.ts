import { invoiceApi } from "@/services/invoice.api";
import type { InvoiceFilters, InvoiceWithVendor } from "@/types";
import { useCallback, useEffect, useState } from "react";

export function useInvoices(filters: InvoiceFilters = {}) {
  const [invoices, setInvoices] = useState<InvoiceWithVendor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const search = filters.search;
    const shouldSearch = !search || search.length >= 2;

    if (shouldSearch && search !== debouncedSearch) setIsSearching(true);

    const timer = setTimeout(() => {
      if (shouldSearch) {
        setDebouncedSearch(search);
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await invoiceApi.getAll({
        ...filters,
        search: debouncedSearch,
      });
      setInvoices(result.invoices);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch invoices");
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearch,
    filters.status,
    filters.source,
    filters.vendor_id,
    filters.date_from,
    filters.date_to,
    filters.page,
    filters.limit,
  ]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    total,
    loading,
    isSearching,
    error,
    refetch: fetchInvoices,
  };
}
