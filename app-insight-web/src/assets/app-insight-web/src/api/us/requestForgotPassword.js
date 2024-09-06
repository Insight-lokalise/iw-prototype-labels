import axios from 'axios'

export default function requestForgotPassword({ username }) {
  const config = {
    headers: {
      'Content-Type': 'text/plain'
    },
  }
  return axios
    .post('/insightweb/endUser/forgotPassword', username, config )
    .catch(error => {
      console.warn('Failed to request forgot password', error)
      throw error
    })
    .then(({ data }) => data)
}
