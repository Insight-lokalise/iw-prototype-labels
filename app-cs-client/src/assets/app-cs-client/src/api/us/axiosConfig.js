import axios from 'axios'

export const DELETE = 'delete'
export const GET = 'get'
export const POST = 'post'
export const PUT = 'put'

const instance = axios.create({
  baseURL: `https://${document.domain}/insightweb/`,
  timeout: 600000,
})

export default instance
