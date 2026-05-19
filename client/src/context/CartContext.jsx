import { createContext, useState, useCallback, useContext, useEffect } from 'react';
import api from '@/lib/axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setItems(res.data.data.items);
      setTotal(res.data.data.total);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(async (bookId, quantity = 1) => {
    const res = await api.post('/cart/items', { bookId, quantity });
    setItems(res.data.data.items);
    setTotal(res.data.data.total);
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    setItems(res.data.data.items);
    setTotal(res.data.data.total);
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const res = await api.delete(`/cart/items/${itemId}`);
    setItems(res.data.data.items);
    setTotal(res.data.data.total);
  }, []);

  const clearCart = useCallback(async () => {
    await api.delete('/cart');
    setItems([]);
    setTotal(0);
  }, []);

  const value = {
    items,
    total,
    loading,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem,
    updateItem,
    removeItem,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
