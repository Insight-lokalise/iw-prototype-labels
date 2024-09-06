import axios from 'axios'

export function checkUserLogin(data) {
  const { email, login, currentPassword, isExisting, receiveInsightEmails} = data
  const payload = {
    accountType:"",
    countryCode:"",
    jobTitle:"",
    email,
    login,
    password: currentPassword,
    confirmPassword:"",
    domainUrl: "",
    existingUser: isExisting,
    receiveInsightEmails,
    ggp: 0,
    gp: 0,
    rp: 0,
  }

  return axios
    .post('/insightweb/checkUserLogin',  payload )
    .catch(error => {
      console.warn('Failed to validate user login', error)
      throw error
    })
    .then(({ data }) => data)
}
