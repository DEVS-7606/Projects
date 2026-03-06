import React, { useState, useEffect } from 'react';
import DataTable from '@/shared/components/DataTable/DataTable';
import FilterBar from '@/shared/components/FilterBar/FilterBar';
import type { Vendor } from '@/types';
import '../styles/VendorsPage.css';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch vendors from Supabase
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = vendors;

    if (searchQuery) {
      filtered = filtered.filter((v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((v) =>
        statusFilter === 'active' ? v.is_active : !v.is_active
      );
    }

    setFilteredVendors(filtered);
  }, [vendors, searchQuery, statusFilter]);

  const vendorColumns = [
    { key: 'name' as const, label: 'Vendor Name', width: '200px' },
    { key: 'email' as const, label: 'Email', width: '200px' },
    { key: 'phone' as const, label: 'Phone', width: '120px' },
    { key: 'gstin' as const, label: 'GSTIN', width: '120px' },
    {
      key: 'is_active' as const,
      label: 'Status',
      width: '100px',
      render: (value: boolean) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="vendors-page">
      <div className="page-header">
        <h1>Vendors</h1>
        <button className="add-button">+ Add Vendor</button>
      </div>

      <FilterBar>
        <input
          type="text"
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </FilterBar>

      <DataTable
        columns={vendorColumns}
        data={filteredVendors}
        loading={loading}
        emptyMessage="No vendors found. Add your first vendor to get started."
      />
    </div>
  );
}
