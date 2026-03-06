import { Outlet } from 'react-router-dom';
import Sidebar from '@/shared/components/Layout/Sidebar';
import './AppShell.css';

export default function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
