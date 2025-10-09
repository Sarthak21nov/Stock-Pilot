import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import { formatDate, isLicenseExpired, isLicenseExpiringSoon } from '../../utils/helpers';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    SupplierName: '',
    SupplierDealing: '',
    SupplierLiscense: '',
    LiscenseValidity: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getSuppliers(currentPage, 10);
      if (response.success) {
        setSuppliers(response.suppliers);
        setTotalPages(response.totalPages);
        setTotalSuppliers(response.TotalSuppliers);
      }
    } catch (error) {
      toast.error('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = editingSupplier
        ? await adminService.updateSupplier(formData)
        : await adminService.addSupplier(formData);

      if (response.success) {
        toast.success(response.message);
        setShowModal(false);
        resetForm();
        fetchSuppliers();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      SupplierName: supplier.SupplierName,
      SupplierDealing: supplier.SupplierDealing,
      SupplierLiscense: supplier.SupplierLiscense,
      LiscenseValidity: supplier.LiscenseValidity.split('T')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (supplierName) => {
    if (!window.confirm(`Are you sure you want to delete ${supplierName}?`)) return;

    try {
      const response = await adminService.deleteSupplier(supplierName);
      if (response.success) {
        toast.success('Supplier deleted successfully');
        fetchSuppliers();
      }
    } catch (error) {
      toast.error('Failed to delete supplier');
    }
  };

  const resetForm = () => {
    setFormData({
      SupplierName: '',
      SupplierDealing: '',
      SupplierLiscense: '',
      LiscenseValidity: ''
    });
    setEditingSupplier(null);
  };

  const columns = [
    { header: 'Supplier Name', accessor: 'SupplierName' },
    { header: 'Business Type', accessor: 'SupplierDealing' },
    { header: 'License Number', accessor: 'SupplierLiscense' },
    {
      header: 'License Validity',
      render: (row) => {
        const expired = isLicenseExpired(row.LiscenseValidity);
        const expiringSoon = isLicenseExpiringSoon(row.LiscenseValidity);

        return (
          <div className="flex items-center gap-2">
            <span>{formatDate(row.LiscenseValidity)}</span>
            {expired && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                Expired
              </span>
            )}
            {!expired && expiringSoon && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                Expiring Soon
              </span>
            )}
          </div>
        );
      }
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
            onClick={() => handleDelete(row.SupplierName)}
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
          <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
          <p className="text-gray-600">Total Suppliers: {totalSuppliers}</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-green-600 font-medium"
        >
          + Add Supplier
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <Table columns={columns} data={suppliers} />
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
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name
            </label>
            <input
              type="text"
              required
              disabled={editingSupplier}
              value={formData.SupplierName}
              onChange={(e) => setFormData({ ...formData, SupplierName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Type
            </label>
            <input
              type="text"
              required
              value={formData.SupplierDealing}
              onChange={(e) => setFormData({ ...formData, SupplierDealing: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="e.g., Electronics, Raw Materials"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <input
              type="text"
              required
              value={formData.SupplierLiscense}
              onChange={(e) => setFormData({ ...formData, SupplierLiscense: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Validity
            </label>
            <input
              type="date"
              required
              value={formData.LiscenseValidity}
              onChange={(e) => setFormData({ ...formData, LiscenseValidity: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

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
              {editingSupplier ? 'Update' : 'Add'} Supplier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupplierManagement;
