import api from './api.js'

export const adminService = {
  callNext: (queueId) => api.post(`/admin/next/${queueId}`).then((r) => r.data),
  skipToken: (tokenId) => api.post(`/admin/skip/${tokenId}`).then((r) => r.data),
  viewWaiting: (queueId) => api.get(`/admin/waiting/${queueId}`).then((r) => r.data),
  viewActive: (queueId) => api.get(`/admin/active/${queueId}`).then((r) => r.data),
  dashboard: (queueId) => api.get(`/admin/dashboard/${queueId}`).then((r) => r.data),
  statistics: () => api.get('/admin/statistics').then((r) => r.data),
}
