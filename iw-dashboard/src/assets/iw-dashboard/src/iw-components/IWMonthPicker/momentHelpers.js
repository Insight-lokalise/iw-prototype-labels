import moment from 'moment'
// TODO: dynamically import only one locale
// TODO: move this file to a more appropriate place
// TODO: make nonmutation function that takes callback
// TODO: write more functions to do things such as date translation

// US site supported locales (en is included in moment as default)
import 'moment/locale/en-ca'
import 'moment/locale/fr-ca'
import 'moment/locale/zh-cn'

// EMEA site supported locales
import 'moment/locale/de'
import 'moment/locale/de-at'
import 'moment/locale/de-ch'
import 'moment/locale/en-gb'
import 'moment/locale/es'
import 'moment/locale/fr'
import 'moment/locale/it'
import 'moment/locale/nl'
import 'moment/locale/sv'

/**
 * uses moment to create an array of locale based month names
 * @param  {string} locale user's locale
 * @return {array}        list of translated month names
 */
export function createLocaleBasedMonthList(locale) {
  const currentLocale = moment.locale()
  moment.locale(locale)
  const localizedMonthList = moment.monthsShort().slice()
  moment.locale(currentLocale)
  return localizedMonthList
}
