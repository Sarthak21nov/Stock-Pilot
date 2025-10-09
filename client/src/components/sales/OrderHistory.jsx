import React, { useState, useEffect } from 'react';
import { salesService } from '../../services/salesService';
import toast from 'react-hot-toast';
import Card from '../common/Card';
import Table from '../common/Table';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await salesService.getAllOrders();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Order ID',
      render: (row) => (
        <span className="font-mono text-sm">{row.OrderId}</span>
      )
    },
    { header: 'Customer', accessor: 'ConsumerName' },
    {
      header: 'Total Cost',
      render: (row) => formatCurrency(row.totalCost)
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[row.Status]}`}>
          {row.Status}
        </span>
      )
    },
    {
      header: 'Order Date',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => setSelectedOrder(row)}
          className="px-3 py-1 bg-primary text-white rounded hover:bg-blue-600"
        >
          View Details
        </button>
      )
    }
  ];

  return (
    <div>
      <Card title="Order History">
        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No orders found. Create your first order to get started!
          </div>
        ) : (
          <Table columns={columns} data={orders} />
        )}
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
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
                  <p className="font-mono font-semibold">{selectedOrder.OrderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
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
                <h4 className="font-semibold text-lg mb-3">Products</h4>
                <div className="space-y-3">
                  {selectedOrder.Products.map((product, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{product.productName}</span>
                        <span className="text-sm text-gray-600">Qty: {product.productQuantity}</span>
                      </div>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div className="flex justify-between">
                          <span>Product Cost:</span>
                          <span>{formatCurrency(product.productCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span className="text-green-600">{product.discountPercentage}%</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base border-t pt-1 mt-1">
                          <span>Net Cost:</span>
                          <span>{formatCurrency(product.netCost)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl">
                  <span className="font-bold">Total Order Cost:</span>
                  <span className="font-bold text-primary">{formatCurrency(selectedOrder.totalCost)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
