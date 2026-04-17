import api from './api';
export const scheduleService = {
  getAll: () => api.get('/pitchschedules'),
  getById: (id) => api.get(`/pitchschedules/${id}`),
  create: (data) => api.post('/pitchschedules', data),
  update: (id, data) => api.put(`/pitchschedules/${id}`, data),
  delete: (id) => api.delete(`/pitchschedules/${id}`),
};
