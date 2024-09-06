import axios from 'axios'

import { getCurrentLocale } from '@insight/toolkit-utils'

import getAemLocale from './getAemLocale'
import { FALLBACK_MENU_DATA } from './constants'
import setCachedAemMenuItems  from './setCachedAemMenuItems'
import {
  INSIGHT_CURRENT_LOCALE_COOKIE_NAME,
  INSIGHT_LOCALE_COOKIE_NAME
} from "./locales";

let cachedResponse

export default function getFooterMenuItems() {

  const domainLocale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
  const currentLocale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)

  if (!cachedResponse) {
    const language = currentLocale.split('_')[0]
    cachedResponse = axios.get(`/aemServices/footer.${getAemLocale(domainLocale)}.${language}.json`).catch(error => {
      console.warn('Failed to fetch footer data', error)
      throw error
    })
  }

  return cachedResponse.then(({ data }) => {
    const aemMenuItems =  { ...FALLBACK_MENU_DATA, ...data }
    const filteredItemMap = aemMenuItems.footerNav.reduce((item, curr) => {
      item[curr.name] = { ...curr }
      return item
    }, {})
    setCachedAemMenuItems(filteredItemMap)
    return  filteredItemMap
  }).catch(error => {
    console.error(error)
    return FALLBACK_MENU_DATA
  })

}
