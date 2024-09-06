import axios from 'axios'

export default function isExistingUser(email) {
  const config = {
    headers: {
      'Content-Type': 'text/plain'
    },
  }
  return axios
    .post('/insightweb/isExistingUser',  email, config )
    .catch(error => {
      console.warn('Failed to identify if existing user', error)
      throw error
    })
    .then(({ data }) => data)
}
