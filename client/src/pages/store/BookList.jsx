import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookService } from '@/services/bookService';
import { categoryService } from '@/services/categoryService';
import BookCard from '@/components/common/BookCard';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/ui/Spinner';
import Select from '@/components/ui/Select';

export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category) params.category = category;
      params.sort = sort;
      params.order = order;

      const res = await bookService.getAll(params);
      setBooks(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, sort, order]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const handleSearch = useCallback((q) => {
    updateParam('search', q);
  }, [searchParams]);

  const sortOptions = [
    { value: 'created_at-desc', label: 'Newest First' },
    { value: 'created_at-asc', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'title-asc', label: 'Title: A to Z' },
    { value: 'title-desc', label: 'Title: Z to A' },
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Browse Books</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by title, author, or ISBN..."
          className="flex-1"
        />
        <Select
          options={categoryOptions}
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          className="sm:w-48"
        />
        <Select
          options={sortOptions}
          value={`${sort}-${order}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split('-');
            const params = new URLSearchParams(searchParams);
            params.set('sort', s);
            params.set('order', o);
            params.delete('page');
            setSearchParams(params);
          }}
          className="sm:w-48"
        />
      </div>

      {loading ? (
        <Spinner className="py-20" size="lg" />
      ) : books.length === 0 ? (
        <EmptyState title="No books found" message="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <Pagination meta={meta} onPageChange={(p) => updateParam('page', String(p))} />
        </>
      )}
    </div>
  );
}
