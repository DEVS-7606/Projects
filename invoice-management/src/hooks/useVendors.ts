import { useEffect, useState, useCallback } from "react";
import { vendorApi } from "@/services/vendor.api";
import type { Vendor } from "@/types";

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await vendorApi.getAll();
      setVendors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vendors");
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return { vendors, loading, error, refetch: fetchVendors };
}
