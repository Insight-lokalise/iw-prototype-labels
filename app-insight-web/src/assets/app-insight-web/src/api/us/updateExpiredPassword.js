import axios from 'axios'

export default function updateExpiredPassword(values) {
  const config = {
    body: JSON.stringify(values),
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return axios
    .post('/insightweb/endUser/updateExpiredPassword', values, config )
    .catch(error => {
      console.warn('Failed to update expired password', error)
      throw error
    })
    .then(({ data }) => data)
}
