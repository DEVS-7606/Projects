import { createBrowserRouter, redirect } from "react-router-dom";
import { Layout } from "@/shared/components/Layout";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import InvoicesPage from "@/features/invoices/pages/InvoicesPage";
import InvoiceDetailPage from "@/features/invoices/pages/InvoiceDetailPage";
import VendorsPage from "@/features/vendors/pages/VendorsPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import { authApi } from "@/services/auth.api";

async function requireAuth() {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    return redirect("/login");
  }

  try {
    const session = await authApi.getSession();
    if (!session.authenticated) {
      return redirect("/login");
    }
    return null;
  } catch {
    return redirect("/login");
  }
}

async function requireGuest() {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    return null;
  }

  try {
    const session = await authApi.getSession();
    if (session.authenticated) {
      return redirect("/dashboard");
    }
    return null;
  } catch {
    return null;
  }
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    loader: requireGuest,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    loader: requireGuest,
  },
  {
    path: "/",
    element: <Layout />,
    loader: requireAuth,
    children: [
      {
        index: true,
        loader: () => redirect("/dashboard"),
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "invoices",
        element: <InvoicesPage />,
      },
      {
        path: "invoices/:id",
        element: <InvoiceDetailPage />,
      },
      {
        path: "vendors",
        element: <VendorsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
