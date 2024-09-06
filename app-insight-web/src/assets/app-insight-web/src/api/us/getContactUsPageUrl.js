import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'

import {
  INSIGHT_CURRENT_LOCALE_COOKIE_NAME
} from "./locales";

export default function getContactUsPageUrl() {
  const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME)

  const localeToContactUsLinkMap = {
    AT: '/about/contact-us.html',
    AU: '/en_AU/about/contact-us.html',
    BE: '/about/contact-us.html',
    CA: '/en_CA/about/contact-us.html',
    CH: '/about/contact-us.html',
    CN: '/zh_CN/about/contact-us.html',
    DE: '/about/contact-us.html',
    ES: '/about/contact-us.html',
    FR: '/about/contact-us.html',
    GB: '/knowledge-base/contact-us.html',
    HK: '/en_HK/about/contact-us.html',
    IE: '/about/contact-us.html',
    IT: '/about/contact-us.html',
    NL: '/knowledge-base/contact-us.html',
    NZ: '/en_NZ/about/contact-us.html',
    SE: '/about/contact-us.html',
    SG: '/en_SG/about/contact-us.html',
    US: '/en_US/about/contact-us.html'
  }

  const countryCode = locale.split("_")[1].toUpperCase();

  return localeToContactUsLinkMap[countryCode] || localeToContactUsLinkMap.US
}