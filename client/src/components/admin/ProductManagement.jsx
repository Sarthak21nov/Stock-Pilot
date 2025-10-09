import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import Card from '../common/Card';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import { formatDate, formatCurrency } from '../../utils/helpers';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    productCategory: '',
    productCost_Wholesale: '',
    productCost_Retail: '',
    productCost_Distributer: '',
    productQuantity: '',
    LastShipment: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await adminService.getProducts(currentPage, 10);
      if (response.success) {
        setProducts(response.products);
        setTotalPages(response.totalPages);
        setTotalProducts(response.ToatlProducts);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = editingProduct
        ? await adminService.updateProduct(formData)
        : await adminService.addProduct(formData);

      if (response.success) {
        toast.success(response.message);
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productCategory: product.productCategory,
      productCost_Wholesale: product.productCost_Wholesale,
      productCost_Retail: product.productCost_Retail,
      productCost_Distributer: product.productCost_Distributer,
      productQuantity: product.productQuantity,
      LastShipment: product.LastShipment.split('T')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (productName) => {
    if (!window.confirm(`Are you sure you want to delete ${productName}?`)) return;

    try {
      const response = await adminService.deleteProduct(productName);
      if (response.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      productCategory: '',
      productCost_Wholesale: '',
      productCost_Retail: '',
      productCost_Distributer: '',
      productQuantity: '',
      LastShipment: ''
    });
    setEditingProduct(null);
  };

  const columns = [
    { header: 'Product Name', accessor: 'productName' },
    { header: 'Category', accessor: 'productCategory' },
    {
      header: 'Wholesale',
      render: (row) => formatCurrency(row.productCost_Wholesale)
    },
    {
      header: 'Retail',
      render: (row) => formatCurrency(row.productCost_Retail)
    },
    {
      header: 'Distributer',
      render: (row) => formatCurrency(row.productCost_Distributer)
    },
    {
      header: 'Quantity',
      render: (row) => (
        <span className={row.productQuantity < 20 ? 'text-red-600 font-semibold' : ''}>
          {row.productQuantity}
        </span>
      )
    },
    {
      header: 'Last Shipment',
      render: (row) => formatDate(row.LastShipment)
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
            onClick={() => handleDelete(row.productName)}
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
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600">Total Products: {totalProducts}</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-green-600 font-medium"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <Table columns={columns} data={products} />
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
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              disabled={editingProduct}
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={formData.productCategory}
              onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wholesale Price
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.productCost_Wholesale}
                onChange={(e) => setFormData({ ...formData, productCost_Wholesale: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retail Price
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.productCost_Retail}
                onChange={(e) => setFormData({ ...formData, productCost_Retail: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distributer Price
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.productCost_Distributer}
                onChange={(e) => setFormData({ ...formData, productCost_Distributer: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                required
                value={formData.productQuantity}
                onChange={(e) => setFormData({ ...formData, productQuantity: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Shipment
              </label>
              <input
                type="date"
                required
                value={formData.LastShipment}
                onChange={(e) => setFormData({ ...formData, LastShipment: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
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
              {editingProduct ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
