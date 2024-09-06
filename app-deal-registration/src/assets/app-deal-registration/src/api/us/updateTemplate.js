import { generatePostRequest } from '../../lib'

export default async function updateTemplate(payload) {
	const response = await fetch('/dealreg/updateTemplate', generatePostRequest(payload))
	return response.json()
}
 
