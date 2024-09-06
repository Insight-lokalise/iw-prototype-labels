import axios from 'axios';

export default function deleteCatalogFields(data) {
  return axios.delete(`outboundCatalog/deleteOBCFieldsConfig`, { data })
    .catch((error) => {
      console.warn(`Failed to delete catalog fields: ${error}`);
      throw error;
    });
}
