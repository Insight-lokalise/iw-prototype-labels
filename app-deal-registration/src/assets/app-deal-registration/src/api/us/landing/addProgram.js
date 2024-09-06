export default async function addProgram({ salesAreaId, manufacturer, program }) {
	const response = await fetch(`dealreg/addProgram/salesAreaid/${salesAreaId}/manufacturer/${manufacturer}/program/${program}`)
	return response.json()
}
