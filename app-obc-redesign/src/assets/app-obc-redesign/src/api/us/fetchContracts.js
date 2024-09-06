import axios from 'axios'

export default function fetchContracts(soldTo, webGroupId) {
  return axios.get(`outboundCatalog/contractsForSoldTo/${soldTo}/${webGroupId}`)
    .catch(error => {
      console.warn(`Faileds to fetch contracts ${error}`)
      throw error
    })
}