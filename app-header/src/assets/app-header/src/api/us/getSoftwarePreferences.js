import axios from "axios";

export function getSoftwarePreferences() {
  return axios
    .post('/insightweb/getSoftwarePreferences')
    .catch(error => {
      console.warn('Failed to get the software preferences ', error)
      throw error
    })
    .then(({data}) => data)
}
