import axios from 'axios'

// const API_BASE_URL = 'https://the-web-backend.onrender.com'

// ensures cookies & tokens are validated
const axiosInstance = axios.create({
  baseURL: "https://the-web-backend.onrender.com",
  withCredentials: true
})

axiosInstance.interceptors.request.use(
  config => {
    if (config.url.includes('/admin/units')) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosInstance
