import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
