export default async function getBrowser() {
	const response = await fetch('/browser')
	return response.text()
}
