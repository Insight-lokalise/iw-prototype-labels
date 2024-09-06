export default function getCookie(cookieName) {
	const emptyString = ''
	const name = `${cookieName}=`
	const cookieList = decodeURIComponent(document.cookie)
	return cookieList
		.split(';')
		.map(untrimmedCookie => untrimmedCookie.trim())
		.reduce(
			(acc, curr) => (curr.indexOf(`${name}`) === 0 ? parseIfPossible(curr.substring(name.length, curr.length)) : acc),
			emptyString
		)
}

function parseIfPossible(value) {
	try {
		return JSON.parse(value)
	} catch (error) {
		return value
	}
}
