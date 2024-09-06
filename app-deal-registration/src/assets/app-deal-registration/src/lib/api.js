const defaultOptions = { isFile: false }

export function generatePostRequest(payload, options = defaultOptions) {
	return {
		body: options.isFile ? payload : JSON.stringify(payload).toString(),
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json, application/xml, text/plain, text/html',
			'Content-Type': options.isFile
				? 'application/xml'
				: 'application/json; charset=UTF-8'
		},
		method: 'POST',
		mode: 'no-cors'
	}
}

export function isValidResponse(response) {
	const base = response !== 0 && !response.error
	const correctStatus = response.status >= 200 && response.status < 400
	return response.status
		? base && correctStatus
		: base
}

export async function makeRequest(api) {
	try {
		const response = await api
		if (isValidResponse(response)) {
			return response
		}
		return response.error || 'Request failed'
	} catch (err) {
		console.error(err)
	}
}
