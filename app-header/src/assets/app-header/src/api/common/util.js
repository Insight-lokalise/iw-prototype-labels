import stringHash from 'string-hash'
import { FILTERED_ITEMS_MAP_LOCAL_STORAGE_ID } from './constants'
import { REGIONS } from './locales'

export function windowRedirect({ redirectURL }) {
  const currentLocation = window.location.href
  // this is basically endsWith but endsWith isn't supported in IE
  if (currentLocation.substring(currentLocation.length - redirectURL.length) === redirectURL) {
    window.location.reload()
  } else {
    window.location.replace(redirectURL)
  }
}

export function getFilteredItemsMapId(userEmail) {
  return `${FILTERED_ITEMS_MAP_LOCAL_STORAGE_ID}-${stringHash(userEmail)}`
}

export function validateEmea(country) {
  return REGIONS[2].countries.includes(country)
}
