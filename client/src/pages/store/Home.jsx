import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '@/services/bookService';
import { categoryService } from '@/services/categoryService';
import BookCard from '@/components/common/BookCard';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [booksRes, catRes] = await Promise.all([
          bookService.getFeatured(),
          categoryService.getAll(),
        ]);
        setFeatured(booksRes.data.data);
        setCategories(catRes.data.data);
      } catch {
        // fail silently for home page
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Spinner className="py-32" size="lg" />;

  return (
    <div>
      <section className="bg-white border-b border-slate-200">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Discover your next favorite book
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Browse our curated collection of books across every genre. From timeless classics to modern bestsellers, find the perfect read.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/books">
                <Button size="lg">Browse Collection</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container-page py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Featured Books</h2>
            <Link to="/books" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="container-page py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/books?category=${cat.id}`}
                className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-primary-300 hover:text-primary-700 text-center transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
