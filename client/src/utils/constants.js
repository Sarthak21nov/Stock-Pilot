export const ROLES = {
  ADMIN: 'admin',
  SALES: 'sales',
  WAREHOUSE: 'warehouse'
};

export const CUSTOMER_TYPES = ['Wholesaler', 'Retailer', 'Distributer'];

export const ORDER_STATUSES = [
  'Placed',
  'Preparing For Transit',
  'Dispatched',
  'Delivered',
  'Cannot be processed'
];

export const STATUS_COLORS = {
  'Placed': 'bg-blue-100 text-blue-800',
  'Preparing For Transit': 'bg-yellow-100 text-yellow-800',
  'Dispatched': 'bg-orange-100 text-orange-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cannot be processed': 'bg-red-100 text-red-800'
};
