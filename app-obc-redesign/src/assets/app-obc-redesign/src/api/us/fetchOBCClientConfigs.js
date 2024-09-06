import axios from 'axios';

export default function fetchOBCClientConfigs(catalogId) {
  return axios.get(`outboundCatalog/getOutboundCatalogFieldConfig/${catalogId}`)
    .catch((error) => {
      console.warn(`Failed to get OBC client configs: ${error}`);
      throw error;
    });
}
