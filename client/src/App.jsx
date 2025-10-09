import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';

// Sales Components
import SalesDashboard from './components/sales/Dashboard';

// Warehouse Components
import WarehouseDashboard from './components/warehouse/Dashboard';

import { ROLES } from './utils/constants';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/sales/*"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SALES]}>
                <SalesDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/warehouse/*"
            element={
              <ProtectedRoute allowedRoles={[ROLES.WAREHOUSE]}>
                <WarehouseDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
