import axios from "axios";

function windowRedirect({ redirectURL }) {
  const currentLocation = window.location.href;
  // this is basically endsWith but endsWith isn't supported in IE
  if (
    currentLocation.substring(currentLocation.length - redirectURL.length) ===
    redirectURL
  ) {
    window.location.reload();
  } else {
    window.location.replace(redirectURL);
  }
}

// legacy pages are implemented using soldtoNumber as the key rather than id
export default function switchAccount({ id, soldtoNumber }) {
  const timestamp = new Date().getTime();
  return axios
    .get(`/insightweb/endUser/changeSoldTo/${id || soldtoNumber}/${timestamp}`)
    .catch((error) => {
      console.warn("Failed to change account", error);
      throw error;
    })
    .then(({ data }) => ({ redirectURL: data.redirectUrl }))
    .then(windowRedirect);
}
