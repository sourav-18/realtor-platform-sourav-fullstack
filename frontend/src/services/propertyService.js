import api from './api';

export const propertyService = {
  getAll: (params = {}) => 
    api.get('/properties', { params }).then(res => res.data),

  getById: (id) => 
    api.get(`/properties/${id}`).then(res => res.data),

  create: (propertyData) => 
    api.post('/properties', propertyData).then(res => res.data),

  update: (id, propertyData) => 
    api.put(`/properties/${id}`, propertyData).then(res => res.data),

  delete: (id) => 
    api.delete(`/properties/${id}`).then(res => res.data),

  getMyProperties: () => 
    api.get('/properties/my-properties').then(res => res.data),
};