export default async function getForms({ manufacturer, program, salesAreaId }) {
	const url = `dealreg/forms/all/1/salesAreaid/${salesAreaId}/manufacturer/${manufacturer}/program/${program}`
	const response = await fetch(url)
	return response.json()
}
