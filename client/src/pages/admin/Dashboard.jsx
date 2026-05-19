import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';
import { formatCurrency, formatDate } from '@/utils';
import { ORDER_STATUS } from '@/config/constants';
import Spinner from '@/components/ui/Spinner';

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentOrders(),
        ]);
        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data);
      } catch {}
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return <Spinner className="py-32" size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers || 0}
          icon="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
        <StatCard
          label="Total Books"
          value={stats?.totalBooks || 0}
          icon="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders || 0}
          icon="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500 text-center">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-slate-500">Order</th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500">Customer</th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500">Amount</th>
                  <th className="text-left px-6 py-3 font-medium text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => {
                  const st = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-3 font-medium text-slate-900">#{order.id}</td>
                      <td className="px-6 py-3 text-slate-600">{order.user_name}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-medium">{formatCurrency(order.total_amount)}</td>
                      <td className="px-6 py-3 text-slate-500">{formatDate(order.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
