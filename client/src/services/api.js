const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://stock-pilot-nine.vercel.app';

class ApiService {
  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // ✅ Already correct
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Handle non-JSON responses (e.g., CORS errors)
        data = { message: 'Server error or CORS issue' };
      }

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
      // More descriptive CORS error message
      if (error.message === 'Failed to fetch') {
        console.error('Possible CORS issue or network error');
      }
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
