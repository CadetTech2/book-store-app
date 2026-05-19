import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { formatCurrency, formatDate } from '@/utils';
import { ORDER_STATUS } from '@/config/constants';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    orderService.getUserOrders({ page, limit: 10 })
      .then((res) => {
        setOrders(res.data.data);
        setMeta(res.data.meta);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <Spinner className="py-32" size="lg" />;

  if (orders.length === 0) {
    return (
      <div className="container-page py-8">
        <EmptyState
          title="No orders yet"
          message="Your order history will appear here after your first purchase."
          action={<Link to="/books"><Button>Start Shopping</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">Order #{order.id}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {formatDate(order.created_at)} · {order.item_count} item{order.item_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-lg font-bold text-slate-900">{formatCurrency(order.total_amount)}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}
