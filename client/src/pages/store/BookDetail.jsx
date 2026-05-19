import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookService } from '@/services/bookService';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { formatCurrency, getImageUrl } from '@/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function BookDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    bookService.getById(id)
      .then((res) => setBook(res.data.data))
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    setAdding(true);
    try {
      await addItem(book.id, quantity);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Spinner className="py-32" size="lg" />;
  if (!book) {
    return (
      <div className="container-page py-16 text-center">
        <h2 className="text-xl font-semibold text-slate-900">Book not found</h2>
        <Link to="/books" className="text-primary-600 text-sm mt-2 inline-block">Back to books</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <Link to="/books" className="text-sm text-slate-500 hover:text-slate-700 mb-6 inline-flex items-center gap-1">
        ← Back to books
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div className="aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden max-w-md">
          {book.cover_image ? (
            <img src={getImageUrl(book.cover_image)} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            {book.category_name && <Badge color="blue">{book.category_name}</Badge>}
            {book.is_featured && <Badge color="yellow">Featured</Badge>}
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-1">{book.title}</h1>
          <p className="text-lg text-slate-600 mb-4">by {book.author}</p>

          <p className="text-3xl font-bold text-primary-700 mb-6">{formatCurrency(book.price)}</p>

          {book.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{book.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            {book.isbn && (
              <div>
                <span className="text-slate-500">ISBN:</span>
                <span className="ml-2 text-slate-900">{book.isbn}</span>
              </div>
            )}
            {book.publisher && (
              <div>
                <span className="text-slate-500">Publisher:</span>
                <span className="ml-2 text-slate-900">{book.publisher}</span>
              </div>
            )}
            {book.pages && (
              <div>
                <span className="text-slate-500">Pages:</span>
                <span className="ml-2 text-slate-900">{book.pages}</span>
              </div>
            )}
            {book.published_year && (
              <div>
                <span className="text-slate-500">Year:</span>
                <span className="ml-2 text-slate-900">{book.published_year}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className={`text-sm font-medium ${book.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {book.stock > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50"
                >−</button>
                <span className="px-4 py-2 text-sm font-medium border-x border-slate-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50"
                >+</button>
              </div>
              <Button onClick={handleAddToCart} loading={adding} className="flex-1">
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
