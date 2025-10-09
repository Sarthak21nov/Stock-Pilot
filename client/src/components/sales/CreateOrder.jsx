import React, { useState, useEffect } from 'react';
import { salesService } from '../../services/salesService';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import Card from '../common/Card';

const CreateOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await adminService.getCustomers(1, 1000);
      if (response.success) {
        setCustomers(response.customers);
      }
    } catch (error) {
      toast.error('Failed to fetch customers');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await adminService.getProducts(1, 1000);
      if (response.success) {
        setProducts(response.products);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { productName: '', productQuantity: 1, discountPercentage: 0 }
    ]);
  };

  const removeOrderItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    setOrderItems(updated);
  };

  const calculateTotal = () => {
    if (!selectedCustomer || orderItems.length === 0) return 0;

    const customer = customers.find(c => c.ConsumerName === selectedCustomer);
    if (!customer) return 0;

    const priceField = {
      'Wholesaler': 'productCost_Wholesale',
      'Retailer': 'productCost_Retail',
      'Distributer': 'productCost_Distributer'
    }[customer.ConsumerType];

    let total = 0;
    orderItems.forEach(item => {
      const product = products.find(p => p.productName === item.productName);
      if (product) {
        const itemCost = product[priceField] * item.productQuantity;
        const discount = (itemCost * item.discountPercentage) / 100;
        total += itemCost - discount;
      }
    });

    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Please add at least one product');
      return;
    }

    // Validate all items have products selected
    const hasEmptyProduct = orderItems.some(item => !item.productName);
    if (hasEmptyProduct) {
      toast.error('Please select products for all items');
      return;
    }

    setLoading(true);

    const orderData = {
      ConsumerName: selectedCustomer,
      Products: orderItems.map(item => ({
        productName: item.productName,
        productQuantity: Number(item.productQuantity),
        discountPercentage: Number(item.discountPercentage)
      }))
    };

    try {
      const response = await salesService.createOrder(orderData);
      
      if (response.success) {
        toast.success('Order created successfully!');
        setSelectedCustomer('');
        setOrderItems([]);
      } else {
        toast.error(response.message || 'Failed to create order');
      }
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const customer = customers.find(c => c.ConsumerName === selectedCustomer);

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Customer
          </label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">-- Choose Customer --</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer.ConsumerName}>
                {customer.ConsumerName} ({customer.ConsumerType})
              </option>
            ))}
          </select>

          {customer && (
            <div className="mt-3 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Type:</strong> {customer.ConsumerType}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Address:</strong> {customer.ConsumerAddress}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Previous Orders:</strong> {customer.OrdersMade}
              </p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Order Items
            </label>
            <button
              type="button"
              onClick={addOrderItem}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-600 text-sm"
            >
              + Add Item
            </button>
          </div>

          {orderItems.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No items added yet. Click "Add Item" to start.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Product
                      </label>
                      <select
                        value={item.productName}
                        onChange={(e) => updateOrderItem(index, 'productName', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">-- Select Product --</option>
                        {products.map((product) => (
                          <option key={product._id} value={product.productName}>
                            {product.productName} (Stock: {product.productQuantity})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.productQuantity}
                        onChange={(e) => updateOrderItem(index, 'productQuantity', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Discount (%)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={item.discountPercentage}
                          onChange={(e) => updateOrderItem(index, 'discountPercentage', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => removeOrderItem(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>

                  {item.productName && customer && (
                    <div className="mt-2 text-sm text-gray-600">
                      {(() => {
                        const product = products.find(p => p.productName === item.productName);
                        if (!product) return null;

                        const priceField = {
                          'Wholesaler': 'productCost_Wholesale',
                          'Retailer': 'productCost_Retail',
                          'Distributer': 'productCost_Distributer'
                        }[customer.ConsumerType];

                        const unitPrice = product[priceField];
                        const itemTotal = unitPrice * item.productQuantity;
                        const discount = (itemTotal * item.discountPercentage) / 100;
                        const finalPrice = itemTotal - discount;

                        return (
                          <div className="flex justify-between">
                            <span>Unit Price: ₹{unitPrice.toFixed(2)}</span>
                            <span>Subtotal: ₹{itemTotal.toFixed(2)}</span>
                            {discount > 0 && <span className="text-green-600">Discount: -₹{discount.toFixed(2)}</span>}
                            <span className="font-semibold">Total: ₹{finalPrice.toFixed(2)}</span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {orderItems.length > 0 && selectedCustomer && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Items:</span>
              <span className="font-semibold">{orderItems.length}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-700">Order Total:</span>
              <span className="text-2xl font-bold text-primary">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || orderItems.length === 0 || !selectedCustomer}
          className="w-full py-4 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Order...' : 'Create Order'}
        </button>
      </form>
    </Card>
  );
};

export default CreateOrder;
