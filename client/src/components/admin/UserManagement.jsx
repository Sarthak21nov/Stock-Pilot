import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { ROLES } from '../../utils/constants';

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      const response = await adminService.addUser(formData);
      if (response.success) {
        toast.success('User created successfully');
        setShowModal(false);
        resetForm();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'sales'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Create and manage system users</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-green-600 font-medium"
        >
          + Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
          <div className="text-purple-600 text-3xl mb-2">👨‍💼</div>
          <h3 className="text-lg font-semibold text-gray-900">Admin Role</h3>
          <p className="text-sm text-gray-600 mt-2">
            Full system access - can manage inventory, suppliers, customers, and users
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <div className="text-blue-600 text-3xl mb-2">💼</div>
          <h3 className="text-lg font-semibold text-gray-900">Sales Role</h3>
          <p className="text-sm text-gray-600 mt-2">
            Can create orders and view customer information
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <div className="text-green-600 text-3xl mb-2">📦</div>
          <h3 className="text-lg font-semibold text-gray-900">Warehouse Role</h3>
          <p className="text-sm text-gray-600 mt-2">
            Can update order status and manage fulfillment operations
          </p>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Add New User"
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value={ROLES.SALES}>Sales</option>
              <option value={ROLES.WAREHOUSE}>Warehouse</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
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
              Create User
            </button>
          </div>
        </form>
      </Modal>
      </div>
    )
}  

export default UserManagement;