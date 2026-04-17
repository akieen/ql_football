import api from './api';
export const bookingService = {
  getAll: () => api.get('/bookings'),
  getByUser: (userId) => api.get(`/bookings/user/${userId}`),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  delete: (id) => api.delete(`/bookings/${id}`),
};
