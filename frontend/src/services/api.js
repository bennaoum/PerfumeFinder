import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const perfumeApi = {
  // Get all perfumes or search
  getPerfumes: (params = {}) => api.get('/perfumes', { params }),
  
  // Get single perfume
  getPerfume: (id) => api.get(`/perfumes/${id}`),
  
  // Get recommendations by perfume ID
  getRecommendations: (id, limit = 10) => api.get(`/recommendations/${id}`, { params: { limit } }),
  
  // Get recommendations by notes
  getRecommendationsByNotes: (notes, filters = {}) => 
    api.post('/recommendations/by-notes', { notes, ...filters }),
  
  // Get all notes
  getNotes: () => api.get('/notes'),
  
  // Get random perfume
  getRandomPerfume: () => api.get('/random'),
  
  // Get filter options
  getFilters: () => api.get('/filters'),
};

export default api;
