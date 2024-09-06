import axios from 'axios'

export function createLimitedAccount(data) {
  const otherJobTitle = 'B8'
  const {accountType, countryCode, jobTitle, email, login, currentPassword, password, confirmPassword, isExistingUser, receiveInsightEmails} = data
  const payload = {
    accountType, countryCode, email, login, confirmPassword, receiveInsightEmails,
    jobTitle : !!jobTitle ? jobTitle : otherJobTitle,
    existingUser: isExistingUser,
    password: !!currentPassword ? currentPassword : password,
    domain: getDomainURL(),
    ggp:0,
    gp:0,
    rp:0,
  }

  return axios
    .post('/insightweb/createLimitedAccount',  payload )
    .catch(error => {
      console.warn('Failed to create limited user', error)
      throw error
    })
    .then(({ data }) => data)
}

function getDomainURL() {
  if (!window.location.origin) {
    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  }
  var domain = window.location.origin;
  if (domain == 'http://localhost:4502') {
    domain = 'http://localhost:8080';
  }
  return domain;
}
