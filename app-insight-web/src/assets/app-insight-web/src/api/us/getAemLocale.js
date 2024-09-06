import { COUNTRIES } from './locales'

export default function getAemLocale(locale) {
  const country = locale.split('_')[1]
  const defaultLanguage = COUNTRIES[country.toLowerCase()].default

  return `${defaultLanguage}_${country}`
}
