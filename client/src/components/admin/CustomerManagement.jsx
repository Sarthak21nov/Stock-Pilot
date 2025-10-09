import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import { CUSTOMER_TYPES } from '../../utils/constants';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    ConsumerName: '',
    ConsumerAddress: '',
    ConsumerType: 'Retailer',
    OrdersMade: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCustomers(currentPage, 10);
      if (response.success) {
        setCustomers(response.customers);
        setTotalPages(response.totalPages);
        setTotalCustomers(response.TotalCustomers);
      }
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      OrdersMade: Number(formData.OrdersMade)
    };

    try {
      const response = editingCustomer
        ? await adminService.updateCustomer(dataToSend)
        : await adminService.addCustomer(dataToSend);

      if (response.success) {
        toast.success(response.message);
        setShowModal(false);
        resetForm();
        fetchCustomers();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      ConsumerName: customer.ConsumerName,
      ConsumerAddress: customer.ConsumerAddress,
      ConsumerType: customer.ConsumerType,
      OrdersMade: customer.OrdersMade
    });
    setShowModal(true);
  };

  const handleDelete = async (consumerName) => {
    if (!window.confirm(`Are you sure you want to delete ${consumerName}?`)) return;

    try {
      const response = await adminService.deleteCustomer(consumerName);
      if (response.success) {
        toast.success('Customer deleted successfully');
        fetchCustomers();
      }
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  const resetForm = () => {
    setFormData({
      ConsumerName: '',
      ConsumerAddress: '',
      ConsumerType: 'Retailer',
      OrdersMade: 0
    });
    setEditingCustomer(null);
  };

  const getCustomerTypeBadge = (type) => {
    const colors = {
      'Wholesaler': 'bg-purple-100 text-purple-800',
      'Retailer': 'bg-blue-100 text-blue-800',
      'Distributer': 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    { header: 'Customer Name', accessor: 'ConsumerName' },
    { header: 'Address', accessor: 'ConsumerAddress' },
    {
      header: 'Type',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCustomerTypeBadge(row.ConsumerType)}`}>
          {row.ConsumerType}
        </span>
      )
    },
    {
      header: 'Orders Made',
      render: (row) => (
        <span className="font-semibold">{row.OrdersMade}</span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.ConsumerName)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
          <p className="text-gray-600">Total Customers: {totalCustomers}</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-green-600 font-medium"
        >
          + Add Customer
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <Table columns={columns} data={customers} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              required
              disabled={editingCustomer}
              value={formData.ConsumerName}
              onChange={(e) => setFormData({ ...formData, ConsumerName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              required
              value={formData.ConsumerAddress}
              onChange={(e) => setFormData({ ...formData, ConsumerAddress: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Type
            </label>
            <select
              value={formData.ConsumerType}
              onChange={(e) => setFormData({ ...formData, ConsumerType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            >
              {CUSTOMER_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              This determines the pricing tier for orders
            </p>
          </div>

          {editingCustomer && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orders Made
              </label>
              <input
                type="number"
                value={formData.OrdersMade}
                onChange={(e) => setFormData({ ...formData, OrdersMade: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-calculated, cannot be manually changed
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
            >
              {editingCustomer ? 'Update' : 'Add'} Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
