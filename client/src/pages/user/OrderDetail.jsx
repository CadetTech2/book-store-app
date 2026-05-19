import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { formatCurrency, formatDate, getImageUrl } from '@/utils';
import { ORDER_STATUS } from '@/config/constants';
import Spinner from '@/components/ui/Spinner';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getById(id)
      .then((res) => setOrder(res.data.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner className="py-32" size="lg" />;
  if (!order) {
    return (
      <div className="container-page py-16 text-center">
        <h2 className="text-xl font-semibold">Order not found</h2>
        <Link to="/orders" className="text-primary-600 text-sm mt-2 inline-block">Back to orders</Link>
      </div>
    );
  }

  const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;

  return (
    <div className="container-page py-8">
      <Link to="/orders" className="text-sm text-slate-500 hover:text-slate-700 mb-6 inline-flex items-center gap-1">
        ← Back to orders
      </Link>

      <div className="mt-4 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Order #{order.id}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Items</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-12 h-16 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                    {item.cover_image ? (
                      <img src={getImageUrl(item.cover_image)} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">N/A</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.author}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-slate-500">{item.quantity} × {formatCurrency(item.price_at_purchase)}</p>
                    <p className="font-medium text-slate-900">{formatCurrency(item.quantity * item.price_at_purchase)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h2 className="font-semibold text-slate-900 mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment</span>
                <span className="capitalize">{order.payment_method?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-primary-700">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h2 className="font-semibold text-slate-900 mb-3">Shipping Address</h2>
            <p className="text-sm text-slate-600">{order.shipping_address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
