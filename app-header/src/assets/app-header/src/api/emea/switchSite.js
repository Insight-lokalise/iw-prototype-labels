import { COUNTRIES } from '../common/locales'

export default function switchLanguage(country, language) {
  const { url, suffixes } = COUNTRIES[country]
  const suffix = suffixes[language]

  window.location = `${url}/${suffix}`
}
