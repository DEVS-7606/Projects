import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppShell from '@/shared/components/Layout/AppShell';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignupPage from '@/features/auth/pages/SignupPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import InvoicesPage from '@/features/invoices/pages/InvoicesPage';
import InvoiceDetailPage from '@/features/invoices/pages/InvoiceDetailPage';
import VendorsPage from '@/features/vendors/pages/VendorsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'invoices',
        element: <InvoicesPage />,
      },
      {
        path: 'invoices/:id',
        element: <InvoiceDetailPage />,
      },
      {
        path: 'vendors',
        element: <VendorsPage />,
      },
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
]);
