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
  async (config) => {
    config.headers['Authorization'] = `Bearer ${sessionStorage.getItem(
      'access_token'
    )}`

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
