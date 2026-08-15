import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Normalizes backend ErrorResponse payloads into a single readable message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data
    const message =
      data?.validationErrors?.join(', ') ||
      data?.message ||
      error.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  },
)

export default api
