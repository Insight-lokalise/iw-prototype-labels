export function getCookieByName(cookieName) {
    let cookieVal = document.cookie
    .split(';')
    .map(untrimmedCookie => decodeURIComponent(untrimmedCookie).trim())
    .find((item) => item.includes(cookieName));
    cookieVal = cookieVal && cookieVal.split('=') && cookieVal.split('=')[1];
    return cookieVal;
}