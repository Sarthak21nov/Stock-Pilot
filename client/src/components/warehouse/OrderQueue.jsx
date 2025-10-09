import React, { useState, useEffect } from 'react';
import { warehouseService } from '../../services/warehouseService';
import toast from 'react-hot-toast';
import Card from '../common/Card';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { ORDER_STATUSES, STATUS_COLORS } from '../../utils/constants';

const OrderQueue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await warehouseService.getAllOrders();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await warehouseService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        toast.success('Order status updated successfully');
        fetchOrders();
        setSelectedOrder(null);
      } else {
        toast.error(response.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.Status === filterStatus);

  const getStatusCount = (status) => {
    return orders.filter(order => order.Status === status).length;
  };

  return (
    <div>
      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {ORDER_STATUSES.map((status) => {
          const count = getStatusCount(status);
          return (
            <div
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                filterStatus === status 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'bg-white hover:shadow-md'
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${STATUS_COLORS[status]}`}>
                {status}
              </div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Clear Filter Button */}
      {filterStatus !== 'all' && (
        <div className="mb-4">
          <button
            onClick={() => setFilterStatus('all')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Clear Filter - Showing {filterStatus} ({filteredOrders.length})
          </button>
        </div>
      )}

      {/* Orders Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading orders...</div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-gray-500">
            {filterStatus === 'all' ? 'No orders found' : `No orders with status "${filterStatus}"`}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <Card key={order._id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-mono text-sm font-semibold">{order._id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.OrderStatus || "Placed"]}`}>
                    {order.OrderStatus || "Placed"}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-semibold">{order.OrderBy}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Item</p>
                    <p className="font-semibold">{order.OrderName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-semibold text-primary">{formatCurrency(order.TotalCost)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Order Date</p>
                  <p className="text-sm">{formatDate(order.createdAt)}</p>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium"
                >
                  Manage Order
                </button>
              </div>
            </Card>
            ))}
        </div>
      )}

      {/* Order Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Manage Order</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-3xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono font-semibold">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[selectedOrder.Status]}`}>
                    {selectedOrder.Status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{selectedOrder.ConsumerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Products to Fulfill</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{selectedOrder.OrderName}</p>
                      <p className="text-sm text-gray-600">Quantity: {selectedOrder.OrderQuantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(selectedOrder.NetCost)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total Cost:</span>
                  <span className="font-bold text-primary">{formatCurrency(selectedOrder.totalCost)}</span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Update Order Status</h4>
                <div className="grid grid-cols-1 gap-2">
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                      disabled={updatingStatus || selectedOrder.Status === status}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        selectedOrder.Status === status
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-blue-600'
                      } disabled:opacity-50`}
                    >
                      {selectedOrder.Status === status ? `Current: ${status}` : `Mark as ${status}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderQueue;
