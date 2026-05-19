import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '@/services/bookService';
import { categoryService } from '@/services/categoryService';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

const defaultForm = {
  title: '', author: '', isbn: '', description: '', price: '',
  stock: '0', category_id: '', pages: '', publisher: '',
  published_year: '', is_featured: false,
};

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit) {
      bookService.getById(id)
        .then((res) => {
          const b = res.data.data;
          setForm({
            title: b.title || '',
            author: b.author || '',
            isbn: b.isbn || '',
            description: b.description || '',
            price: String(b.price || ''),
            stock: String(b.stock || 0),
            category_id: b.category_id ? String(b.category_id) : '',
            pages: b.pages ? String(b.pages) : '',
            publisher: b.publisher || '',
            published_year: b.published_year ? String(b.published_year) : '',
            is_featured: !!b.is_featured,
          });
        })
        .catch(() => toast.error('Book not found'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.price) {
      toast.error('Title, author, and price are required');
      return;
    }

    setSaving(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        pages: form.pages ? parseInt(form.pages) : null,
        published_year: form.published_year ? parseInt(form.published_year) : null,
        isbn: form.isbn || null,
        description: form.description || null,
        publisher: form.publisher || null,
      };

      let bookId;
      if (isEdit) {
        await bookService.update(id, data);
        bookId = id;
        toast.success('Book updated');
      } else {
        const res = await bookService.create(data);
        bookId = res.data.data.id;
        toast.success('Book created');
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append('cover', imageFile);
        await bookService.uploadImage(bookId, formData);
      }

      navigate('/admin/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner className="py-32" size="lg" />;

  const categoryOptions = [
    { value: '', label: 'Select category' },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{isEdit ? 'Edit Book' : 'Add New Book'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
          <Input
            label="Title *"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          <Input
            label="Author *"
            value={form.author}
            onChange={(e) => handleChange('author', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price *"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
            <Input
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
            />
          </div>
          <Input
            label="ISBN"
            value={form.isbn}
            onChange={(e) => handleChange('isbn', e.target.value)}
          />
          <Select
            label="Category"
            options={categoryOptions}
            value={form.category_id}
            onChange={(e) => handleChange('category_id', e.target.value)}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Publisher"
              value={form.publisher}
              onChange={(e) => handleChange('publisher', e.target.value)}
            />
            <Input
              label="Published Year"
              type="number"
              value={form.published_year}
              onChange={(e) => handleChange('published_year', e.target.value)}
            />
          </div>
          <Input
            label="Pages"
            type="number"
            value={form.pages}
            onChange={(e) => handleChange('pages', e.target.value)}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={form.is_featured}
              onChange={(e) => handleChange('is_featured', e.target.checked)}
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="is_featured" className="text-sm text-slate-700">Featured book</label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>{isEdit ? 'Update Book' : 'Create Book'}</Button>
          <Button variant="secondary" onClick={() => navigate('/admin/books')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
