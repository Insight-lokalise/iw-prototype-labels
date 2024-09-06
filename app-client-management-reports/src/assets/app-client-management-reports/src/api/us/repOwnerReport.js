import axios from 'axios'

export function repOwnerReport({email}) {
  const payload = {
    email
  }

  return axios
    .post('/insightweb/report/repOwner',  payload )
    .catch(error => {
      console.warn('Failed to submit last login report', error)
      throw error
    })
    .then(({ data }) => data)
}
