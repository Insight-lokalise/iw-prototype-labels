import axios from "axios";

export function postSyncGuestCheckout(reqBody) {
  return axios
    .post('/insightweb/synch', reqBody)
    .catch(error => {
      console.warn('Failed to sync guest shopping request with the loggedin user shopping request', error)
      throw error
    })
    .then(({data}) => data)
}
