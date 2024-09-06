import axios from 'axios';

export default function fetchRunCount({ catalogId, salesOrg }) {
  return axios.get(`outboundCatalog/productcount/${catalogId}/${salesOrg}`)
    .catch((error) => {
      console.warn(`Failed to get run count: ${error}`);
      throw error;
    });

}
