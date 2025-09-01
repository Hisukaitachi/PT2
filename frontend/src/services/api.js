import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Task API functions
export const taskAPI = {
  // Get all tasks
  getTasks: (params = {}) => api.get('/tasks', { params }),
  
  // Get single task
  getTask: (id) => api.get(`/tasks/${id}`),
  
  // Create new task
  createTask: (taskData) => api.post('/tasks', taskData),
  
  // Update task
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  
  // Delete task
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

export default api;