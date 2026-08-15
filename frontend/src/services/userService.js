import api from './api.js'

export const userService = {
  register: (payload) => api.post('/users', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/users/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/users/${id}`).then((r) => r.data),
  getById: (id) => api.get(`/users/${id}`).then((r) => r.data),
  list: (search) => api.get('/users', { params: search ? { search } : {} }).then((r) => r.data),
}
