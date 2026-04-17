import api from './api';
export const pitchService = {
  getAll: () => api.get('/pitches'),
  create: (formData) => api.post('/pitches', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/pitches/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/pitches/${id}`),
};
