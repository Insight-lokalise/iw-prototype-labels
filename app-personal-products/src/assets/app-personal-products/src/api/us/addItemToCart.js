import axios from 'axios'

export default function addItemToCart(cartURL, item) {
  const timestamp = new Date().getTime()
	return axios.post(`${cartURL}?_=${timestamp}`, item)
		.catch(error => {
			console.warn(`Failed to add item ${JSON.stringify(item)} to cart`)
			throw error
		})
}
