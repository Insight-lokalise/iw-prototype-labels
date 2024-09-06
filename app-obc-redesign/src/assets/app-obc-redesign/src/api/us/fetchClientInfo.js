import axios from 'axios';

export default function fetchClientInfo() {
  return axios.get(`outboundCatalog/obcClientInformation/${window.webGroupId}`)
    .catch((error) => {
    console.warn(`Failed to fetch OBC ClientInfo ${error}`);
    throw error;
  })
}