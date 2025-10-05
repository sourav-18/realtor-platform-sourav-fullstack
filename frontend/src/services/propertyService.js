import api from './api';

export const propertyService = {
  getAll: () =>
    api.get('/properties').then(res => res.data),

  getById: (id) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return api.get(`/properties/${id}`, { headers: {} }).then(res => res.data)
  },

  create: (propertyData) =>
    api.post('/properties', propertyData).then(res => res.data),

  update: (id, propertyData) =>
    api.put(`/properties/${id}`, propertyData).then(res => res.data),

  delete: (id) =>
    api.delete(`/properties/${id}`).then(res => res.data),

  getMyProperties: () =>
    api.get('/properties/my-properties').then(res => res.data),
};