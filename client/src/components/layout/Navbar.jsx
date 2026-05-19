import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-primary-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 4H3a1 1 0 00-1 1v14a1 1 0 001 1h18a1 1 0 001-1V5a1 1 0 00-1-1zM8 18H4V6h4v12zm6 0h-4V6h4v12zm6 0h-4V6h4v12z" />
            </svg>
            <span className="text-xl font-bold text-slate-900">BookVault</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/books" className="text-sm text-slate-600 hover:text-slate-900">Browse</Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="text-sm text-slate-600 hover:text-slate-900">Orders</Link>
                <Link to="/cart" className="relative text-sm text-slate-600 hover:text-slate-900">
                  Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-sm text-slate-600 hover:text-slate-900">Admin</Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-sm text-slate-600 hover:text-slate-900">
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-3">
            <Link to="/books" className="block text-sm text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Browse</Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="block text-sm text-slate-600" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
                <Link to="/cart" className="block text-sm text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                  Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
                <Link to="/profile" className="block text-sm text-slate-600" onClick={() => setMobileMenuOpen(false)}>{user?.name}</Link>
                {isAdmin && (
                  <Link to="/admin" className="block text-sm text-slate-600" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block text-sm text-slate-500">Logout</button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="block text-sm text-slate-600" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block text-sm text-primary-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
