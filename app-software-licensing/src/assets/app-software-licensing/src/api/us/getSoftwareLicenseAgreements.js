import axios from 'axios'

export default function getSoftwareLicenseAgreements() {
  const response = axios.get(`/insightweb/softwareAgreements`).catch(error => {
    console.warn('Failed to get software agreements', error)
    return { data: null }
  });  
  return response
}
