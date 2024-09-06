import axios from 'axios'

export default function requestPCMPasswordReset({ email }) {
  const config = {
    headers: {
      'Content-Type': 'text/plain'
    },
  }
  return axios
    .post('/insightweb/pcm/resetPassword',  email, config )
    .catch(error => {
      console.warn('Failed to request password reset', error)
      throw error
    })
    .then(({ data }) => data)
}

