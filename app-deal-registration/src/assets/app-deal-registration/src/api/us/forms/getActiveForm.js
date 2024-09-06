export default async function getActiveForm({ salesAreaId, manufacturer, program }) {
	const response = await fetch(`/dealreg/forms/active/1/salesAreaid/${salesAreaId}/manufacturer/${manufacturer}/program/${program}`)
  return response.json()
}
