import axios from 'axios';

export default function fetchSetupDeliveryData(catalogId) {
  return axios.get(`outboundCatalog/getOBCommunicationConfig/${catalogId}`, {crossDomain: true})
    .catch((error) => {
      console.warn(`Failed to get setup delivery data: ${error}`);
      throw error;
    });
}
