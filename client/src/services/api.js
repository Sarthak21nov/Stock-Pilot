const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://stock-pilot-2.onrender.com';

// const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('userRole');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      return { ...data, status: response.status };
    } catch (error) {
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();
