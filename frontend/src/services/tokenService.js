import api from './api.js'

export const tokenService = {
  join: (queueId, userId) => api.post(`/queues/${queueId}/join`, { userId }).then((r) => r.data),
  getById: (id) => api.get(`/tokens/${id}`).then((r) => r.data),
  trackPosition: (id) => api.get(`/tokens/${id}/position`).then((r) => r.data),
  confirm: (id) => api.post(`/tokens/${id}/confirm`).then((r) => r.data),
  complete: (id) => api.post(`/tokens/${id}/complete`).then((r) => r.data),
  cancel: (id) => api.post(`/tokens/${id}/cancel`).then((r) => r.data),
}
