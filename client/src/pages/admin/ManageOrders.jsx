import { useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { formatCurrency, formatDate } from '@/utils';
import { ORDER_STATUS } from '@/config/constants';
import Pagination from '@/components/common/Pagination';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await orderService.getAll(params);
      setOrders(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      toast.success('Status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.entries(ORDER_STATUS).map(([value, { label }]) => ({ value, label })),
  ];

  const statusSelectOptions = Object.entries(ORDER_STATUS).map(([value, { label }]) => ({
    value,
    label,
  }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Orders</h1>
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="sm:w-48"
        />
      </div>

      {loading ? (
        <Spinner className="py-20" />
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 hidden sm:table-cell">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">#{order.id}</p>
                      <p className="text-xs text-slate-500 sm:hidden">{order.user_name}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-slate-900">{order.user_name}</p>
                      <p className="text-xs text-slate-500">{order.user_email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(order.total_amount)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        {statusSelectOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No orders found</p>
          )}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}
