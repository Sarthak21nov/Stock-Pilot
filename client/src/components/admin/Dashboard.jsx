import React, { useState } from 'react';
import Navbar from '../common/Navbar';
import ProductManagement from './ProductManagement';
import SupplierManagement from './SupplierManagement';
import CustomerManagement from './CustomerManagement';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'suppliers', label: 'Suppliers', icon: '🏭' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'users', label: 'Users', icon: '👤' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your inventory, suppliers, and customers</p>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'suppliers' && <SupplierManagement />}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
