import { setCookie, updateCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import getSearchHistorySimple, { SEARCH_HISTORY_SIMPLE_COOKIE_NAME } from './getSearchHistorySimple'

export default function updateSearchHistory(searchTerm) {
  // we only want the searchHistory cookie to contain the 5 most recent searches
  const newValue = [{ value: searchTerm }]

  updateCookie(SEARCH_HISTORY_SIMPLE_COOKIE_NAME, addToSearchHistoryCookie, newValue)

  function addToSearchHistoryCookie(searchHistoryCookie) {
    const cookieDoesNotAlreadyContainValue = searchHistoryCookie.filter(bite => bite.value === searchTerm).length === 0
    if (cookieDoesNotAlreadyContainValue) {
      const fiveMostRecentSearches = searchHistoryCookie.slice(0, 4)
      setCookie(SEARCH_HISTORY_SIMPLE_COOKIE_NAME, [...newValue, ...fiveMostRecentSearches])
    } else {
      // move newValue to 0 index of array
      const cookieWithNewValueFilteredOut = searchHistoryCookie.filter(bite => bite.value !== searchTerm)
      setCookie(SEARCH_HISTORY_SIMPLE_COOKIE_NAME, [...newValue, ...cookieWithNewValueFilteredOut])
    }
  }

  return getSearchHistorySimple()
}
