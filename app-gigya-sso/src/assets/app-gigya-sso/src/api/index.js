import axios from 'axios'

const noop = () => {};

export function fetchGigyaApiKey(uri) {
  return axios.get(uri).catch(error => {
    console.warn('Failed to fetch gigya API key', error)
    throw error
  })
}

export function fetchHeaderInformation() {
  return axios.get("/insightweb/headerInformation")
}

export function onAuthentication(uri, data) {
  const {
    UID,
    UIDSignature,
    locale,
    signatureTimestamp,
    redirectTo,
  } = data

  let form = document.createElement("Form")
  form.action = uri
  form.method="post"
  Object.keys(data).forEach((key)=>{
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = data[key]
    form.appendChild(input);
  })
  document.body.appendChild(form)
  form.submit()
}

// Gigya Data Logging API
export function gigyaDataLogging ({
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
