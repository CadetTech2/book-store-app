import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './routes/guards';

import Home from '@/pages/store/Home';
import BookList from '@/pages/store/BookList';
import BookDetail from '@/pages/store/BookDetail';
import Cart from '@/pages/store/Cart';
import Checkout from '@/pages/store/Checkout';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Profile from '@/pages/user/Profile';
import OrderHistory from '@/pages/user/OrderHistory';
import OrderDetail from '@/pages/user/OrderDetail';
import Dashboard from '@/pages/admin/Dashboard';
import ManageBooks from '@/pages/admin/ManageBooks';
import BookForm from '@/pages/admin/BookForm';
import ManageUsers from '@/pages/admin/ManageUsers';
import ManageOrders from '@/pages/admin/ManageOrders';

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
      </Route>

      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/books" element={<ManageBooks />} />
        <Route path="/admin/books/new" element={<BookForm />} />
        <Route path="/admin/books/:id/edit" element={<BookForm />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
      </Route>

      <Route path="*" element={
        <MainLayout />
      } />
    </Routes>
  );
}
