import getSearchHistoryStore from './getSearchHistoryStore'
import { SEARCH_HISTORY_STORE } from './updateSearchHistoryStore'

export default function removeFromSearchHistoryStore({ phrase }) {

    const searchHistory = window.localStorage.getItem(SEARCH_HISTORY_STORE)
    removeSearchHistory(searchHistory)

    function removeSearchHistory(searchHistory) {
        const updatedLocalStoreage = (JSON.parse(searchHistory)).filter(bite => bite.text !== phrase)
        try {
            window.localStorage.setItem(SEARCH_HISTORY_STORE, JSON.stringify([...updatedLocalStoreage]))
        } catch (error) {
            console.warn(error)
        }
    }
    return getSearchHistoryStore()

}
