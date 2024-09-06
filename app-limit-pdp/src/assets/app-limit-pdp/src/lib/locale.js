import axios from 'axios'
import { getRegion, getCurrentLocale } from '@insight/toolkit-utils'
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from '@constants'

export const getLocaleMetadata = () => {
  const currentLocale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
  const locale = currentLocale.toUpperCase()
  const splitLocale = locale.split('_')
  const countryCode = splitLocale[1]
  const language = splitLocale[0]

  return { market: countryCode, language, locale }
}

export const getCnetConifg = async () => {
  const locale = getRegion(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)
  const metadata = getLocaleMetadata()
  let selectedLocale = locale
  let key = 'DEFAULT'

  const { data } = await axios.get(`/aemServices/config.cnet-configs.json`)
  // Check mapping for current c-code
  if (data.market_mapping[locale]) {
    selectedLocale = data.market_mapping[locale]
  }
  if (locale === 'EMEA') key = selectedLocale
  // Pass the current c-code to find the account
  const config = data.accounts[key]
  return { ...config, ...metadata }
}
