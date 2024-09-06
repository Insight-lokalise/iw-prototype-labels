import { getCurrentLocale, getRegion } from '@insight/toolkit-utils'

const INSIGHT_LOCALE_COOKIE_NAME = 'insight_current_locale'

export const getCountryCode = () => {
  const currentLocale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
  return currentLocale.split('_')[1].toUpperCase()
}
export const isDefaultLoggedOut = (isLoggedIn) => {
  return !isLoggedIn && getRegion(INSIGHT_LOCALE_COOKIE_NAME) === 'NA'
}

export const isCesExperience = (isLoggedIn, isCES) =>
  isDefaultLoggedOut(isLoggedIn) || isCES
