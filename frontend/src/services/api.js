import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Ensure the base URL includes /api/v1 if it's missing (a common issue when setting env vars)
if (API_BASE_URL && !API_BASE_URL.endsWith('/api/v1') && !API_BASE_URL.endsWith('/api/v1/')) {
    try {
        const urlObj = new URL(API_BASE_URL);
        // If the URL has no path other than '/', append '/api/v1'
        if (urlObj.pathname === '/' || urlObj.pathname === '') {
            API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api/v1';
        }
    } catch (e) {
        // Ignore invalid URLs here, axios will fail later anyway
    }
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const reviewService = {
  summarize: async (businessName, location) => {
    const response = await api.post('/summarize', {
      business_name: businessName,
      location: location,
    });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },
};
