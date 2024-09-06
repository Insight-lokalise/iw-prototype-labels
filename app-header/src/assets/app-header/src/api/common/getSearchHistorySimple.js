import { getCookie, hasCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'

export const SEARCH_HISTORY_SIMPLE_COOKIE_NAME = 'searchHistorySimple'

export default function getSearchHistory() {
  const cookiePromise = hasCookie(SEARCH_HISTORY_SIMPLE_COOKIE_NAME)
    ? Promise.resolve(getCookie(SEARCH_HISTORY_SIMPLE_COOKIE_NAME))
    : Promise.resolve([])

  return cookiePromise.then(searchHistory => ({
    suggestions: searchHistory.map(({ value }) => ({
      value,
    }))
  }))
}
