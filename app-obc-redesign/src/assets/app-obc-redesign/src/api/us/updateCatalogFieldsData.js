import axios from 'axios';

export default function updateCatalogFieldsData(data) {
  return axios.post(`outboundCatalog/saveOBCFieldConfig`, data)
    .catch((error) => {
      console.warn(`Failed to update catalog fields: ${error}`);
      throw error;
    });
}
