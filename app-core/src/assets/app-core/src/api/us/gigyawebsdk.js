import axios from "axios";

const noop = () => {};

export function fetchGigyaApiKey(uri) {
  return axios.get(uri).catch(error => {
    console.warn('Failed to fetch gigya API key', error)
    throw error
  })
}

// Log Gigya Data
export default function gigyaDataLogging ({
  url = '/insightweb/logdata',
  data = {},
  onSuccess = noop,
  onFailure = noop
} = {}) {
  return axios.post(url, data)
  .then((resp) => {
      onSuccess(resp.data);
  })
  .catch((error) => {
    console.error('Error while Logging Gigya data: ', error);
    onFailure();
  });
}

export function fetchHeaderInformation() {
  return axios.get("/insightweb/headerInformation")
}
