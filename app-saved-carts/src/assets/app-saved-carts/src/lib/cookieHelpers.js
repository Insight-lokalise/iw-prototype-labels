import { getRegion } from '@insight/toolkit-utils'

export const INSIGHT_LOCALE_COOKIE_NAME = 'insight_current_locale'
export const PDP_LOCALE_COOKIE_NAME = 'insight_locale'

export function getCookie(cookieName) {
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

export function hasCookie(cookieName) {
  return getCookie(cookieName) !== ''
}

export function setCookie(cookieName, cookieValue) {
  const d = new Date()
  d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000)
  const defaultExpirationDate = d.toUTCString()
  const value =  encodeURIComponent(JSON.stringify(cookieValue))
  document.cookie = `${cookieName}=${value};expires=${defaultExpirationDate};path=/`
}

export function updateCookie(cookieName, editCookieCallback, defaultCookieValue) {
  if (hasCookie(cookieName)) {
    const currentCookie = getCookie(cookieName)
    editCookieCallback(currentCookie)
  } else {
    setCookie(cookieName, defaultCookieValue)
  }
}

function parseIfPossible(value) {
	try {
		return JSON.parse(value)
	} catch (error) {
		return value
	}
}
