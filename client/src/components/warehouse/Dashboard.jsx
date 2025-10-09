import React from 'react';
import Navbar from '../common/Navbar';
import OrderQueue from './OrderQueue';

const WarehouseDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Warehouse Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage order fulfillment and status updates</p>
        </div>

        <OrderQueue />
      </div>
    </div>
  );
};

export default WarehouseDashboard;
