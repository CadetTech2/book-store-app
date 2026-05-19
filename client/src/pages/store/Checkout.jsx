import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils';
import { PAYMENT_METHODS } from '@/config/constants';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, total, fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ shippingAddress: '', paymentMethod: 'credit_card' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.shippingAddress || form.shippingAddress.length < 10) {
      errs.shippingAddress = 'Please enter a complete shipping address (min 10 chars)';
    }
    if (!form.paymentMethod) errs.paymentMethod = 'Please select a payment method';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const res = await orderService.create(form);
      await fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h2 className="font-semibold text-slate-900 mb-4">Shipping Address</h2>
            <Textarea
              label="Full Address"
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
              error={errors.shippingAddress}
              placeholder="Street address, city, state, zip code, country"
              rows={3}
            />
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h2 className="font-semibold text-slate-900 mb-4">Payment Method</h2>
            <Select
              options={PAYMENT_METHODS}
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              error={errors.paymentMethod}
            />
          </div>

          <Button type="submit" loading={loading} size="lg" className="w-full">
            Place Order — {formatCurrency(total)}
          </Button>
        </form>

        <div className="bg-white p-6 rounded-lg border border-slate-200 h-fit">
          <h2 className="font-semibold text-slate-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate-600 truncate pr-2">
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium text-slate-900 flex-shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary-700">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
