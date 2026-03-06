import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">InvoiceHub</h1>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Dashboard</span>
        </Link>

        <Link
          to="/invoices"
          className={`nav-item ${isActive('/invoices') ? 'active' : ''}`}
        >
          <span className="nav-icon">📄</span>
          <span className="nav-label">Invoices</span>
        </Link>

        <Link
          to="/vendors"
          className={`nav-item ${isActive('/vendors') ? 'active' : ''}`}
        >
          <span className="nav-icon">🏢</span>
          <span className="nav-label">Vendors</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
