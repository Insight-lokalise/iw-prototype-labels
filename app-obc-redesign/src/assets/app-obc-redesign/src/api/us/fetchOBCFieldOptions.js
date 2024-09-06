import axios from 'axios';

export default function fetchOBCFieldOptions() {
  return axios.get(`outboundCatalog/getOBCFieldOptions`)
    .catch((error) => {
      console.warn(`Failed to get catalog fields: ${error}`);
      throw error;
    });
}
