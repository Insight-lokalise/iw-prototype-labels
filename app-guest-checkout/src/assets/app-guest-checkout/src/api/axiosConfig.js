import axios from 'axios'

export const DELETE = 'delete'
export const GET = 'get'
export const POST = 'post'
export const PUT = 'put'

const instance = axios.create({
  baseURL: `https://${document.domain}/`,
  timeout: 600000,
})

instance.interceptors.request.use(
  (config) => {
  const accessToken = sessionStorage.getItem('access_token')
    if(accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    if (error.response.status == 401) {
      document.location.href = '/insightweb/login'
    } else {
      return Promise.reject(error)
    }
  }
)

export default instance
