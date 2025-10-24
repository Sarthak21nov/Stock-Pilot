import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success) {
        login(response.role);
        toast.success(response.message);
        
        switch (response.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'sales':
            navigate('/sales/dashboard');
            break;
          case 'warehouse':
            navigate('/warehouse/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='overflow-y-auto'>
      <p className=' bg-blue-500 text-white p-5'>Hey Folks! Thanks for visiting the website. This is just the first version of the website. This is a SaaS - Which has been created for the purpose of learning and demonstration. Below are the testing credentials for the website. <br /> AdminEmail: saru@email.com <br /> SalesEmail: sales@email.com <br /> WarehouseEmail: warehouse@email.com <br /> Password: 1234567890 "Password is same for all the testing emails. Thank you for your cooperation."</p>
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md md:translate-y-[-15%] translate-y-[-30%]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">StockPilot</h1>
          <p className="text-gray-600 mt-2">B2B Inventory Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-primary hover:underline font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Login;
