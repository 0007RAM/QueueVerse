import api from './api.js'

export const queueService = {
  create: (payload) => api.post('/queues', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/queues/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/queues/${id}`).then((r) => r.data),
  getById: (id) => api.get(`/queues/${id}`).then((r) => r.data),
  list: () => api.get('/queues').then((r) => r.data),
  pause: (id) => api.post(`/queues/${id}/pause`).then((r) => r.data),
  resume: (id) => api.post(`/queues/${id}/resume`).then((r) => r.data),
  statistics: (id) => api.get(`/queues/${id}/statistics`).then((r) => r.data),
}
