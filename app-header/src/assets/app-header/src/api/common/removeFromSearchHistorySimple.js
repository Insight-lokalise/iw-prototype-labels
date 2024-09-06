import { setCookie, updateCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import getSearchHistory, { SEARCH_HISTORY_SIMPLE_COOKIE_NAME } from './getSearchHistorySimple'

export default function removeFromSearchHistory({ value }) {
  updateCookie(SEARCH_HISTORY_SIMPLE_COOKIE_NAME, removeFromSearchHistoryCookie, [])

  function removeFromSearchHistoryCookie(searchHistoryCookie) {
    const updatedCookie = searchHistoryCookie.filter(bite => bite.value !== value)
    setCookie(SEARCH_HISTORY_SIMPLE_COOKIE_NAME, [...updatedCookie])
  }

  return getSearchHistory()
}
