import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container-page py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-primary-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 4H3a1 1 0 00-1 1v14a1 1 0 001 1h18a1 1 0 001-1V5a1 1 0 00-1-1zM8 18H4V6h4v12zm6 0h-4V6h4v12zm6 0h-4V6h4v12z" />
              </svg>
              <span className="text-lg font-bold text-slate-900">BookVault</span>
            </Link>
            <p className="text-sm text-slate-500">
              Your destination for books across every genre. Discover, browse, and order from our curated collection.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/books" className="block text-sm text-slate-500 hover:text-slate-700">Browse Books</Link>
              <Link to="/books?sort=created_at&order=desc" className="block text-sm text-slate-500 hover:text-slate-700">New Arrivals</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Account</h4>
            <div className="space-y-2">
              <Link to="/login" className="block text-sm text-slate-500 hover:text-slate-700">Login</Link>
              <Link to="/register" className="block text-sm text-slate-500 hover:text-slate-700">Register</Link>
              <Link to="/orders" className="block text-sm text-slate-500 hover:text-slate-700">Order History</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 mt-8 pt-6 text-center">
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} BookVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
