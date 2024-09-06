import axios from 'axios'

export default function getPersonalProducts() {
	return axios.get('/insightweb/favitems/details')
		.catch(error => {
			console.warn('Failed to fetch favorite items')
			throw error
		})
}
