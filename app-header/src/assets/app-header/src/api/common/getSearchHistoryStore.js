import { SEARCH_HISTORY_STORE } from './updateSearchHistoryStore'

export default function getSearchHistoryStore() {
    const storePromise = (window.localStorage.getItem(SEARCH_HISTORY_STORE))
    ? Promise.resolve(window.localStorage.getItem(SEARCH_HISTORY_STORE))
    : Promise.resolve([])

    return storePromise.then((searchHistory) => {
        if (searchHistory && searchHistory.length !== 0) {
            return {
                results: (JSON.parse(searchHistory)).map(({ itemCategoryLabel, text}) => ({
                    category: itemCategoryLabel,
                    phrase: text,
                }))      
            }
        }
    })
}

   