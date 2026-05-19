import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { formatCurrency, getImageUrl } from '@/utils';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, total, loading, updateItem, removeItem } = useCart();

  const handleQuantityChange = async (itemId, newQty) => {
    try {
      await updateItem(itemId, newQty);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <Spinner className="py-32" size="lg" />;

  if (items.length === 0) {
    return (
      <div className="container-page py-8">
        <EmptyState
          title="Your cart is empty"
          message="Browse our collection and add books to your cart."
          action={<Link to="/books"><Button>Browse Books</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg border border-slate-200">
              <div className="w-20 h-28 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                {item.cover_image ? (
                  <img src={getImageUrl(item.cover_image)} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/books/${item.book_id}`} className="font-semibold text-slate-900 text-sm hover:text-primary-700">
                  {item.title}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">{item.author}</p>
                <p className="text-sm font-bold text-primary-700 mt-1">{formatCurrency(item.price)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-slate-300 rounded">
                    <button
                      onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
                    >−</button>
                    <span className="px-3 py-1 text-xs font-medium border-x border-slate-300">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
                    >+</button>
                  </div>
                  <button onClick={() => handleRemove(item.id)} className="text-xs text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900 text-sm">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 h-fit">
          <h2 className="font-semibold text-slate-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal ({items.length} items)</span>
              <span className="font-medium">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary-700">{formatCurrency(total)}</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full mt-4">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
