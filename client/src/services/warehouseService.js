import api from './api';

export const warehouseService = {
  updateOrderStatus: async (orderId, status) => {
    return await api.put(`/api/order/updateStatus/${orderId}`, { status });
  },

  getAllOrders: async () => {
    return await api.get('/api/order/getAllOrders');
  }
};
