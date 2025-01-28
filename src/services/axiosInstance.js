import axios from 'axios'

// ensures cookies & tokens are validated
const axiosInstance = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL}`,
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
