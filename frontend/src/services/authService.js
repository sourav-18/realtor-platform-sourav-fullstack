import api from './api';

export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }).then(res => res.data),

  register: (userData) => 
    api.post('/auth/register', userData).then(res => res.data),

  getProfile: () => 
    api.get('/auth/profile').then(res => res.data),

  updateProfile: (userData) => 
    api.put('/auth/profile', userData).then(res => res.data),
};