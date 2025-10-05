import api from './api';

export const authService = {
  ownerRegister: (userData) => 
    api.post('/auth/owner/signup', userData).then(res => res.data),

  customerRegister: (userData) => 
    api.post('/auth/customer/signup', userData).then(res => res.data),

  ownerLogin: (userData) => 
    api.post('/auth/owner/login', userData).then(res => res.data),

  customerLogin: (userData) => 
    api.post('/auth/customer/login', userData).then(res => res.data),

  getProfile: () => 
    api.get('/auth/profile').then(res => res.data),

  updateProfile: (userData) => 
    api.put('/auth/profile', userData).then(res => res.data),
};