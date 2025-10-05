import api from './api';

export const propertyService = {
  getAll: (params = {}) =>
    api.get('/properties', { params }).then(res => res.data),

  getById: (id) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return api.get(`/properties/details/${id}`, { headers: {} }).then(res => res.data)
  },

  create: (propertyData) =>
    api.post('/properties', propertyData).then(res => res.data),

  update: (id, propertyData) =>
    api.put(`/properties/${id}`, propertyData).then(res => res.data),

  statusUpdate: (id, status) =>
    api.patch(`/properties/${id}/status/${status}`, status).then(res => res.data),

  delete: (id) =>
    api.delete(`/properties/${id}`).then(res => res.data),

  getMyProperties: (params = {}) =>
    api.get('/properties/list-by-owner',{ params }).then(res => res.data),
};