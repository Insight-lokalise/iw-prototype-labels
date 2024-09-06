import { getCookie, hasCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'

export const SEARCH_HISTORY_COOKIE_NAME = 'searchHistory'

export default function getSearchHistory() {
  const cookiePromise = hasCookie(SEARCH_HISTORY_COOKIE_NAME)
    ? Promise.resolve(getCookie(SEARCH_HISTORY_COOKIE_NAME))
    : Promise.resolve([])

  return cookiePromise.then(searchHistory => ({
    results: searchHistory.map(({ itemCategoryLabel, text }) => ({
      category: itemCategoryLabel,
      phrase: text,
    })),
  }))
}
