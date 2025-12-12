import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useToast } from '@/composables/useToast.ts'

const BASE_URL = import.meta.env.VITE_BASE_URL_API
const TIMEOUT = 100000
const toast = useToast()

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Здесь можно добавить токен авторизации, если потребуется
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // обработка ответов
    if (import.meta.env.DEV) {
    }
    return response
  },
  (error: AxiosError) => {
    // обработка ошибок
    return Promise.reject(error)
  },
)

export default apiClient
