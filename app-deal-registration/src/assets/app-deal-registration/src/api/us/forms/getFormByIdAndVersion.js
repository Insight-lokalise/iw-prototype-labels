export default async function getFormByIdAndVersion(formId, versionId) {
	const response = await fetch(`/dealreg/forms/1/formid/${formId}/versionid/${versionId}`)
	return response.json()
}
