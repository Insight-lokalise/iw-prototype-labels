export default async function getUser() {
	const response = await fetch('/user')
	return response.json()
}
