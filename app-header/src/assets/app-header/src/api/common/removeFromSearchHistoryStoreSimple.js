import { SEARCH_HISTORY_STORE_SIMPLE } from './updateSearchHistoryStoreSimple'
import getSearchHistoryStoreSimple from './getSearchHistoryStoreSimple'

export default function removeFromSearchHistoryStoreSimple({ value }) {
    const searchHistory = window.localStorage.getItem(SEARCH_HISTORY_STORE_SIMPLE)
    removeSearchHistory(searchHistory)

    function removeSearchHistory(searchHistory) {
        const updatedLocalStoreage = (JSON.parse(searchHistory)).filter(bite => bite.value !== value)
        try {
            window.localStorage.setItem(SEARCH_HISTORY_STORE_SIMPLE, JSON.stringify([...updatedLocalStoreage]))
        } catch (error) {
            console.warn(error)
        }
    }
    return getSearchHistoryStoreSimple()
}
