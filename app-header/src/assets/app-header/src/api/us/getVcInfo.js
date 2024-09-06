import axios from "axios";

export function getVcInfo() {
  return axios
    .get('/insightweb/transaction/vcinfo')
    .catch(error => {
      console.warn('Failed to fetch VC information', error)
      throw error
    })
    .then(({data}) => data)
}
