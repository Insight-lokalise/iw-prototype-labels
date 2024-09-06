import axios, { GET } from './axios'

export const getPersonalProducts = async () => {
  try {
	const { data } = await axios({
	  method: GET,
	  url: '/insightweb/favitems/details',
	})
	const allPersonalProductLists = []
	Object.values(data?.products).map(product => allPersonalProductLists.push(product?.materialId))
	return allPersonalProductLists
  } catch (err) {
	if (err.response?.data?.message) err = new Error(err.response.data.message)
	console.warn(`Failed to fetch personal product lists`, err)
  }
}



