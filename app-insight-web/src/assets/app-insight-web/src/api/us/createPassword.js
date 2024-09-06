import axios from 'axios'

export default function createPassword({ password, resetPasswordToken }) {
  const req = { newPassword: password, token: resetPasswordToken }
  const config = {
    body: JSON.stringify(req),
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return axios
    .post('/insightweb/endUser/createPassword', req, config )
    .catch(error => {
      console.warn('Failed to create reset password', error)
      throw error
    })
    .then(({ data }) => data)
}
