import axios from 'axios';

export default function updateSetupDeliveryData(data) {
  return axios.post(`outboundCatalog/saveOBCommunicationConfig`, data)
    .catch((error) => {
      console.warn(`Failed to update delivery data: ${error}`);
      throw error;
    });
}
