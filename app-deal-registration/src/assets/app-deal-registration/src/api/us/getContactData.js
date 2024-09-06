export default async function getContactData(contactNumber) {
	const response = await fetch(`https://services.insight.com/services/loadRelationshipData/${contactNumber}`)
	return response.json()
}
