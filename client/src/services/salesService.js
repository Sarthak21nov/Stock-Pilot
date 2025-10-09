import api from './api';

export const salesService = {
  createOrder: async (orderData) => {
    return await api.post('/api/order/RequestOrder', orderData);
  },

  getAllOrders: async () => {
    return await api.get('/api/order/getAllOrders');
  }
};
