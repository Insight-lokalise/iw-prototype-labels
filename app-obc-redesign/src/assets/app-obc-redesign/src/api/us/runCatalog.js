import axios from 'axios';

export default function runCatalog(catalogId) {
  return axios.get(`export/file/${catalogId}`)
    .catch((error) => {
      console.warn(`Failed to run catalog: ${error}`);
      throw error;
    });
}
