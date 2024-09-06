import axios from "axios";

export function saveUserInfoToShoppingRequest(payload) {
  return axios.post(`/gapi/cart/shoppingrequest/user-account-info`, payload)
    .catch((error) => {
      console.warn(`Failed to update shopping request with user info: ${error}`);
      throw error;
    });
}
