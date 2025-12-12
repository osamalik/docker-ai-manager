import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'X-API-KEY': API_KEY }),
  },
});

export const dockerService = {
  listContainers: () => api.get('/containers'),
  getContainerStats: (id: string) => api.get(`/containers/${id}/stats`),
  startContainer: (id: string) => api.post(`/containers/${id}/start`),
  stopContainer: (id: string) => api.post(`/containers/${id}/stop`),
  restartContainer: (id: string) => api.post(`/containers/${id}/restart`),
  getContainerLogs: (id: string) => api.get(`/containers/${id}/logs`),
  inspectContainer: (id: string) => api.get(`/containers/${id}/inspect`),
  removeContainer: (id: string) => api.delete(`/containers/${id}`),
  
  listImages: () => api.get('/images'),
  getDockerInfo: () => api.get('/docker/info'),
  
  analyzeContainerLogs: (id: string) => api.post(`/ai/analyze-logs/${id}`),
  getOptimizationSuggestions: (id: string) => api.get(`/ai/optimize/${id}`),
  getCostAnalysis: () => api.get('/ai/cost-analysis'),
  naturalLanguageCommand: (query: string) => api.post('/ai/natural-language', { query }),
};
