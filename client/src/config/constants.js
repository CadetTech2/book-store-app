export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const UPLOAD_URL = import.meta.env.VITE_API_URL?.replace('/api', '/uploads') || '/uploads';
export const PER_PAGE = 12;

export const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'cod', label: 'Cash on Delivery' },
];
