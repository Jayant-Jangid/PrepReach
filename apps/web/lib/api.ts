import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// ─── Request interceptor: attach access token ──────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor: handle 401 & refresh ───────────────────────────
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (reason: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearTokens()
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        })
        const { accessToken, refreshToken: newRefreshToken } = data.data
        saveTokens(accessToken, newRefreshToken)
        processQueue(null, accessToken)
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearTokens()
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api

// ─── Typed API helpers ────────────────────────────────────────────────────────

export const authAPI = {
  register: (name: string, email: string) =>
    api.post('/auth/register', { name, email }),
  login: (email: string) =>
    api.post('/auth/login', { email }),
  verifyOTP: (email: string, otp: string, purpose: string) =>
    api.post('/auth/verify-otp', { email, otp, purpose }),
  resendOTP: (email: string, purpose: string) =>
    api.post('/auth/resend-otp', { email, purpose }),
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh-token', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

export const coursesAPI = {
  list: (params?: Record<string, unknown>) => api.get('/courses', { params }),
  get: (id: string) => api.get(`/courses/${id}`),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (data: unknown) => api.post('/courses', data),
  update: (id: string, data: unknown) => api.put(`/courses/${id}`, data),
  publish: (id: string) => api.put(`/courses/${id}/publish`),
  enroll: (id: string) => api.post(`/courses/${id}/enroll`),
  getModules: (id: string) => api.get(`/courses/${id}/modules`),
}

export const enrollmentsAPI = {
  my: () => api.get('/enrollments/my'),
  check: (courseId: string) => api.get(`/enrollments/${courseId}/check`),
  checkEnrollment: (courseId: string) => api.get(`/enrollments/${courseId}/check`),
  enroll: (courseId: string) => api.post(`/enrollments/${courseId}`),
  updateProgress: (courseId: string, data: unknown) =>
    api.put(`/enrollments/${courseId}/progress`, data),
}

export const instructorAPI = {
  dashboard: () => api.get('/instructor/dashboard'),
  courses: () => api.get('/instructor/courses'),
}
