import axios from 'axios'
import { getAemLocale, getFixedToolsMenuItems, getHeaderInformation, setCachedAemMenuItems } from 'api'
import { getCurrentLocale } from '@insight/toolkit-utils'
import { INSIGHT_LOCALE_COOKIE_NAME, INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from '../common/locales'
import { FALLBACK_MENU_DATA } from './constants'

let cachedResponse

export default function getAemMenuItems() {
  if (!cachedResponse) {
    cachedResponse = getHeaderInformation().then(({ locale, isIPSUser }) => {

      //domainLocale will always be using insight_locale
      //language will be driven from insight_current_locale
      //ips append "_ips" (isIPSUser will only be true for US only)
      const domainLocale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
      const currentLocale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
      const aemLocale = isIPSUser ? `${getAemLocale(domainLocale)}_IPS`: getAemLocale(domainLocale)
      const language = currentLocale.split('_')[0]

      return Promise.all([
        axios.get(`/aemServices/header.${aemLocale}.${language}.json`),
        getFixedToolsMenuItems(),
      ])

        .then(([aemResponse, fixedToolsItems]) => {
          const aemMenuItems = { ...FALLBACK_MENU_DATA, ...aemResponse.data }

          // add fixed menu items to tools
          aemMenuItems.tools.nodes = [...fixedToolsItems, ...aemMenuItems.tools.nodes]

          setCachedAemMenuItems(aemMenuItems)

          return aemMenuItems
        })
        .catch(error => {
          console.error(error)
          return FALLBACK_MENU_DATA
        })
    })
  }

  return cachedResponse
}
