import { setCookie, updateCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import getSearchHistory, { SEARCH_HISTORY_COOKIE_NAME } from './getSearchHistory'

export default function updateSearchHistory(searchTerm) {
  // we only want the searchHistory cookie to contain the 10 most recent searches
  const newValue = [{ text: searchTerm, textBy: true }]

  updateCookie(SEARCH_HISTORY_COOKIE_NAME, addToSearchHistoryCookie, newValue)

  function addToSearchHistoryCookie(searchHistoryCookie) {
    const cookieDoesNotAlreadyContainValue = searchHistoryCookie.filter(bite => bite.text === searchTerm).length === 0
    if (cookieDoesNotAlreadyContainValue) {
      const nineMostRecentSearches = searchHistoryCookie.slice(0, 9)
      setCookie(SEARCH_HISTORY_COOKIE_NAME, [...newValue, ...nineMostRecentSearches])
    } else {
      // move newValue to 0 index of array
      const cookieWithNewValueFilteredOut = searchHistoryCookie.filter(bite => bite.text !== searchTerm)
      setCookie(SEARCH_HISTORY_COOKIE_NAME, [...newValue, ...cookieWithNewValueFilteredOut])
    }
  }

  return getSearchHistory()
}
