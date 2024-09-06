import axios from "axios";

export default function getCartItemsCount() {
  const timestamp = new Date().getTime();
  return axios
    .get(`/insightweb/cartItemCount?_=${timestamp}`)
    .catch((error) => {
      console.warn("Failed to fetch cart data", error);
      throw error;
    })
    .then(({ data }) => data.quantity);
}
