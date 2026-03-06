import React from 'react';
import './FilterBar.css';

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  children?: React.ReactNode;
}

export default function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-content">{children}</div>
    </div>
  );
}
