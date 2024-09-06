/**
 * Parse the document cookies for a specific cookie, returning the value.
 */
export function getCookie(cookieName) {
  const name = `${cookieName}=`
  const cookieList = decodeURIComponent(document.cookie)

  return cookieList
    .split(';')
    .map(untrimmedCookie => untrimmedCookie.trim())
    .reduce(
      (acc, curr) => {
        return curr.indexOf(name) === 0
          ? parseIfPossible(curr.substring(name.length, curr.length))
          : acc
      },
      ''
    )
}

/**
 * 
 */
function parseIfPossible(value) {
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}
