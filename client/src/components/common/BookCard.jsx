import { Link } from 'react-router-dom';
import { formatCurrency, getImageUrl, truncate } from '@/utils';
import Badge from '@/components/ui/Badge';

export default function BookCard({ book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
        {book.cover_image ? (
          <img
            src={getImageUrl(book.cover_image)}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        {book.is_featured && (
          <Badge color="yellow" className="absolute top-2 left-2">Featured</Badge>
        )}
      </div>
      <div className="p-4">
        {book.category_name && (
          <p className="text-xs text-primary-600 font-medium mb-1">{book.category_name}</p>
        )}
        <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 mb-2">{book.author}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary-700">{formatCurrency(book.price)}</span>
          {book.stock > 0 ? (
            <span className="text-xs text-green-600">In Stock</span>
          ) : (
            <span className="text-xs text-red-500">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
