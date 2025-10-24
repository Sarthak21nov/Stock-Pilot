const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://stock-pilot-nine.vercel.app';

class ApiService {
  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // ✅ ensures cookies/tokens are sent
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        console.error(`API Error (${response.status}):`, data);
      }

      if (response.status === 401) {
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      }

      return { ...data, status: response.status };
    } catch (error) {
      console.error("Fetch error:", error);
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
