import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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
