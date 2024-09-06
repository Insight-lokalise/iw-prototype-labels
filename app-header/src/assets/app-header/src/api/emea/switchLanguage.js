export default function switchLanguage(country, language) {
  const { origin, pathname, search } = window.location
  const ulang = language === 'en' ? 'en-gb' : language
  const newSearch = search.replace(/ulang=([a-z\-]+)/, '')

  window.location = `${origin}${pathname}${newSearch}${newSearch ? '&' : '?'}ulang=${ulang}`
}
