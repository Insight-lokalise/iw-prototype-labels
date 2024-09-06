import { connectToLocale, dateFormat, currencyFormat } from '@insight/toolkit-react'
import {
  ariaPhoneFormat,
  getCurrentLocale,
  getRegion,
  getInObject,
  getContactNumber,
  getConfigLabels,
  getUTCTimeStamp,
  validateEmail,
  validateZipcode,
  validatePhoneNumber,
  normalizeLocaleForLabels,
} from '@insight/toolkit-utils'

import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest'

// expose small set of Toolkit common functions for legacy pages to use

function ToolkitCommon({ context }) {  

  window.ToolkitCommon = {}

  window.ToolkitCommon.normalizeLocaleForLabels = (locale) => {
    return normalizeLocaleForLabels(locale)
  }

  /**
  * validate email address
  * @typedef {Object}
  * @property {String} date
  * @property {String} [locale] //Example: en_US
  * @property {String} [type] //one of SUPPORTED_DATE_TYPES
  * @property {boolean} [utc] //show UTC time (optional)
  **/
  window.ToolkitCommon.validateEmail = (email) => {    
    return validateEmail(email)
  }

  /**
  * validate zip code
  * @typedef {Object}
  * @param  {String} zipcode          Zipcode to validate
  * @param  {String} [countryCode]    User's set countryCode
  * @param  {Boolean} [isApac=false]  whether user is in APAC
  * @param  {Boolean} [isEMEA=false]  whether user is in isEMEA
  * @return {Boolean}                 Whether zipcode is valid
  **/
  window.ToolkitCommon.validateZipcode = ({ zipcode, countryCode, isApac, isEMEA }) => {    
    return validateZipcode({ zipcode, countryCode, isApac, isEMEA })
  }

  /**
  * validate phone number
  * @typedef {Object}
  * @param  {String} phoneNumber          phoneNumber to validate
  * @param  {Boolean} [isApac=false]    whether user is in APAC
  * @param  {Boolean} [isEMEA=false]    whether user is in isEMEA
  * @return {Boolean}                 Whether phoneNumber is valid
  **/
  window.ToolkitCommon.validatePhoneNumber = ({ phoneNumber, isAPAC, isEMEA}) => {    
    return validatePhoneNumber({ phoneNumber, isAPAC, isEMEA})
  }

  /**
   * Format a phone number to something that sounds better read by reader.
   *     "1800.INSIGHT" returns "1. 8 0 0. 4 6 7. 4 4 4 8."
   *     "+33 (0)1 30 67 25 00" returns "+ 3 3. 0 1. 3 0. 6 7. 2 5. 0 0."
   * @param  {String} phoneNumber      phoneNumber to convert
   * @return {String}                  phoneNumber formatted for aria
   **/
  window.ToolkitCommon.ariaPhoneFormat = ( phoneNumber ) => {
    return ariaPhoneFormat( phoneNumber );
  }

  /**
  * date string formatter based on the current locale.
  * @typedef {Object}
  * @property {String} date
  * @property {String} [locale] //Example: en_US
  * @property {String} [type] //one of SUPPORTED_DATE_TYPES
  * @property {boolean} [utc] //show UTC time (optional)
  **/
  window.ToolkitCommon.dateFormat = ({date, locale, type, utc}) => {
    const localeString = (locale || (context && context.locale) || 'en_US')
    const typeString = type || "date"
    return dateFormat({date, locale: localeString, type: typeString, utc})
  }

  /**
  * get current locale from cookie
  * @property {String} currentLocale //current locale cookie name
  * @property {String} [domainLocale] //domain locale cookie name (optional)
   **/
  window.ToolkitCommon.getCurrentLocale = (currentLocale, domainLocale) => {
    return getCurrentLocale(currentLocale, domainLocale)
  }

  /**
  * determine region base on country code from domain locale
  * @property {String} domainLocale //domain locale cookie name
   **/
  window.ToolkitCommon.getRegion = (domainLocale) => {
    return getRegion(domainLocale)
  }

  /**
   * get company-config json for contact#, header & footer links for emails
   * @property {String} currentLocale //current locale cookie name
   **/
  window.ToolkitCommon.getCompanyConfig = (locale) => {
    return getConfigLabels(locale)
  }

  /**
  * display contact number by locale
  * @property {String} localeValue //locale value, IE: en_US
  **/
    window.ToolkitCommon.getContactNumber = (localeValue) => {
    return getContactNumber(localeValue)
  }

  /**
  * currency formatter based on locale and currency code
  * @typedef {Object}
  * @property {Number} price //price value
  * @property {String} currency //Example: USD
  * @property {String} [locale] //Example: en_US
  * @property {boolean} [showVat] //show VAT suffix
  * @property {boolean} [tax] //tax included in price
  * @property {boolean} [highlight] //highlight currency display
   **/
  window.ToolkitCommon.currencyFormat = ({price, currency, locale, showVAT, tax, highlight}) => {
    const localeString = (locale || (context && context.locale) || 'en_US')
    const highlightClass = highlight ? "c-currency__highlight" : ""
    
    // Show VAT included message if required.
    const taxIncluded = tax !== undefined ? tax : context && context.tax
    const { value, prefix, suffix } = currencyFormat(price, localeString, currency, taxIncluded)

    return currencyRender({ prefix, value, suffix, showVAT, highlightClass })
  }

  window.ToolkitCommon.addToCartRequest = (payload, addToShoppingRequest) => {
    return addToCartRequest( payload, addToShoppingRequest )
  }

  window.ToolkitCommon.getInObject = getInObject

  window.ToolkitCommon.getUTCTimeStamp = getUTCTimeStamp

  /**
  * Currency renderer for legacy pages.
  * @typedef {Object}
  * @property {String} prefix
  * @property {String} value
  * @property {String} suffix
  * @property {boolean} [showVat] //show VAT suffix
  * @property {boolean} [highlight] //highlight currency display
  **/
  function currencyRender({ prefix, value, suffix, showVAT, highlightClass }) {
    
    const prefixString = prefix ? `<span class="c-currency__code ${highlightClass}">${prefix} </span>` : ''
    const suffixString = showVAT && suffix ? `<span class="c-currency__tax"> ${suffix}</span>` : ''

    return `${prefixString} <span class="c-currency__value ${highlightClass}">${value}</span> ${suffixString}` 
  }

  return null
}

export default connectToLocale(ToolkitCommon)
