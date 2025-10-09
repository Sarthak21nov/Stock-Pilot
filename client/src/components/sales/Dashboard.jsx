import React, { useState } from 'react';
import Navbar from '../common/Navbar';
import CreateOrder from './CreateOrder';
import OrderHistory from './OrderHistory';

const SalesDashboard = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-1">Create orders and track sales history</p>
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'create'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📝 Create Order
          </button>
          {/* <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'history'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📋 Order History
          </button> */}
        </div>

        <div>
          {activeTab === 'create' && <CreateOrder />}
          {activeTab === 'history' && <OrderHistory />}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
