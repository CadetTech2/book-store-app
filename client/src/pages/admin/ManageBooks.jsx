import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '@/services/bookService';
import { formatCurrency } from '@/utils';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookService.getAll({ page, limit: 10, search });
      setBooks(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleDelete = async () => {
    try {
      await bookService.delete(deleteId);
      toast.success('Book deleted');
      setDeleteId(null);
      fetchBooks();
    } catch {
      toast.error('Failed to delete book');
    }
  };

  const handleSearch = useCallback((q) => {
    setSearch(q);
    setPage(1);
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Books</h1>
        <Link to="/admin/books/new">
          <Button>Add Book</Button>
        </Link>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Search books..." className="mb-4" />

      {loading ? (
        <Spinner className="py-20" />
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Author</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 hidden sm:table-cell">Stock</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map((book) => (
                  <tr key={book.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 truncate max-w-[200px]">{book.title}</p>
                      <p className="text-xs text-slate-500 md:hidden">{book.author}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{book.author}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(book.price)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={book.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/books/${book.id}/edit`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(book.id)} className="text-red-500 hover:text-red-700">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {books.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No books found</p>
          )}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Book"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">Are you sure you want to delete this book? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
