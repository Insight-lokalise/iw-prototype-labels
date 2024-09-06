import { setCookie, updateCookie, getCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import { getRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import flushFilterMenuCache from './flushFilterMenuCache'
import { COUNTRIES, INSIGHT_LOCALE_COOKIE_NAME, INSIGHT_CURRENT_LOCALE_COOKIE_NAME, REGION_CODE  } from '../common/locales'

export default function switchLanguage(country, language, isLoggedIn = false) {
  const domainLocale = getCookie(INSIGHT_LOCALE_COOKIE_NAME)
  const nextLocale = getCookieValues(country, language)
  const { href, origin, pathname, search } = window.location
  const ayearfromnow = new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000) )
  const cookieoptions = {expires: ayearfromnow, path:"/", samesite: "none", secure: true}

  // update domain cookie with the new locale for NON-EMEA countries (EMEA will stay on default locale for landing pages)
  if(getRegion(INSIGHT_LOCALE_COOKIE_NAME) != REGION_CODE.EMEA) {        
    updateCookie(INSIGHT_LOCALE_COOKIE_NAME, () => setCookie(INSIGHT_LOCALE_COOKIE_NAME, nextLocale, cookieoptions), nextLocale, cookieoptions)
  }
  // update the current locale cookie with the new current locale (for application pages)
  updateCookie(INSIGHT_CURRENT_LOCALE_COOKIE_NAME, () => setCookie(INSIGHT_CURRENT_LOCALE_COOKIE_NAME, nextLocale, cookieoptions), nextLocale, cookieoptions)

  // if the locale is a part of the url (eg we are on a content page and) change the locale in the url - else we reload
  // EMEA landing pages will stay on default locale so no need to update locale in the url
  let nextLocation;
  if (getRegion(INSIGHT_LOCALE_COOKIE_NAME) != REGION_CODE.EMEA && href.includes(domainLocale)) {
    nextLocation = href.replace(domainLocale, nextLocale)
  } else {
    const newSearch = search.replace(/(&ulang=([a-z\-]+)|ulang=([a-z\-]+))/, '')
    nextLocation = `${origin}${pathname}${newSearch}${newSearch ? '&' : '?'}ulang=${language}`
  }
  if(isLoggedIn) {
    flushFilterMenuCache().then(()=>{
      window.location = nextLocation
    })
  } else {
    window.location = nextLocation
  }
}

function getCookieValues(country, language) {
  const { name: countryName } = COUNTRIES[country]
  let locale = `${language}_${country.toUpperCase()}`
  return locale
}
