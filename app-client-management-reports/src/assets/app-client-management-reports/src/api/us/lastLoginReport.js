import axios from 'axios'

export function lastLoginReport(data) {
  const {hierarchy, hierarchyNumber, startDate, endDate, email} = data
  const payload = {
    startDate,
    endDate,
    emailIds: email.split(/,|;/),
    [hierarchy]:hierarchyNumber,
  }

  return axios
    .post('/insightweb/report/lastLogin',  payload )
    .catch(error => {
      console.warn('Failed to submit last login report', error)
      throw error
    })
    .then(({ data }) => data)
}


