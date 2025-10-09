import api from './api';

export const adminService = {
  // Product APIs
  addProduct: async (productData) => {
    return await api.post('/api/admin/addProduct', productData);
  },

  getProducts: async (pages = 1, limit = 10) => {
    return await api.get(`/api/admin/getProducts?pages=${pages}&limit=${limit}`);
  },

  updateProduct: async (productData) => {
    return await api.put('/api/admin/updateProduct', productData);
  },

  deleteProduct: async (productName) => {
    return await api.delete(`/api/admin/deleteProduct/${encodeURIComponent(productName.toLowerCase())}`);
  },

  // Supplier APIs
  addSupplier: async (supplierData) => {
    return await api.post('/api/admin/addSupplier', supplierData);
  },

  getSuppliers: async (pages = 1, limit = 10) => {
    return await api.get(`/api/admin/getSuppliers?pages=${pages}&limit=${limit}`);
  },

  updateSupplier: async (supplierData) => {
    return await api.put('/api/admin/updateSupplier', supplierData);
  },

  deleteSupplier: async (supplierName) => {
    return await api.delete(`/api/admin/deleteSupplier/${encodeURIComponent(supplierName)}`);
  },

  // Customer APIs
  addCustomer: async (customerData) => {
    return await api.post('/api/admin/AddCustomer', customerData);
  },

  getCustomers: async (pages = 1, limit = 10) => {
    return await api.get(`/api/admin/getCustomer?pages=${pages}&limit=${limit}`);
  },

  updateCustomer: async (customerData) => {
    return await api.put('/api/admin/updateCustomer', customerData);
  },

  deleteCustomer: async (consumerName) => {
    return await api.delete(`/api/admin/deleteCustomer/${encodeURIComponent(consumerName)}`);
  },

  // User Management APIs
  addUser: async (userData) => {
    return await api.post('/api/manipulation/addUser', userData);
  },

  updateUserRole: async (userId, role) => {
    return await api.put(`/api/manipulation/updateUserRole/${userId}`, { role });
  },

  deleteUser: async (userId) => {
    return await api.delete(`/api/manipulation/deleteUser/${userId}`);
  }
};
