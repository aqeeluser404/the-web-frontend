import axios from 'axios'

// ensures cookies & tokens are validated
const axiosInstance = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL}`,
  withCredentials: true
})

axiosInstance.interceptors.request.use(
  config => {
    // Handle multipart uploads for admin units
    if (config.method === 'post' && config.url.includes('/admin/units')) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    // Handle multipart uploads for rentals
    if (config.method === 'post' && config.url.includes('/rentals')) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    // Handle multipart uploads for call logs with images
    if (config.method === 'post' && config.url.includes('/call-log')) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    // Handle multipart uploads for call logs (admin update)
    if (config.method === 'put' && config.url.includes('/call-log')) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosInstance
