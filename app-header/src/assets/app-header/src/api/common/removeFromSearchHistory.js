import { setCookie, updateCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import getSearchHistory, { SEARCH_HISTORY_COOKIE_NAME } from './getSearchHistory'

export default function removeFromSearchHistory({ phrase }) {
  updateCookie(SEARCH_HISTORY_COOKIE_NAME, removeFromSearchHistoryCookie, [])

  function removeFromSearchHistoryCookie(searchHistoryCookie) {
    const updatedCookie = searchHistoryCookie.filter(bite => bite.text !== phrase)
    setCookie(SEARCH_HISTORY_COOKIE_NAME, [...updatedCookie])
  }

  return getSearchHistory()
}
