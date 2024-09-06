import getSearchHistoryStore from './getSearchHistoryStore'

export const SEARCH_HISTORY_STORE = 'searchHistoryStore'

export default function updateSearchHistoryStore(searchTerm) {
    addToSearchHistoryStore(searchTerm)

    function addToSearchHistoryStore(searchTerm) {
        const newValue = [{ text: searchTerm, textBy: true }]

        const searchHistoryResult = window.localStorage.getItem(SEARCH_HISTORY_STORE);
        const searchHistoryResultStatus = searchHistoryResult && (searchHistoryResult !== null || searchHistoryResult !== "" || typeof searchHistoryResult === "string" && searchHistoryResult.trim().length !== 0)

        if (searchHistoryResultStatus) {
            const prevSearchHistory = JSON.parse(window.localStorage.getItem(SEARCH_HISTORY_STORE))
            const storeDoesNotAlreadyContainValue = prevSearchHistory.filter(bite => bite.text === searchTerm).length === 0

            // To store only 10 most recent searches in searchHistoryStore
            if (storeDoesNotAlreadyContainValue) {
                const nineMostRecentSearches = prevSearchHistory.slice(0, 9)
                try {
                    window.localStorage.setItem(SEARCH_HISTORY_STORE, JSON.stringify([...newValue, ...nineMostRecentSearches]))
                } catch (error) {
                    console.warn(error)
                }
            } else {
                const localStorageWithNewValueFilteredOut = prevSearchHistory.filter(bite => bite.text !== searchTerm)
                try {
                    window.localStorage.setItem(SEARCH_HISTORY_STORE, JSON.stringify([...newValue, ...localStorageWithNewValueFilteredOut]))
                } catch (error) {
                    console.warn(error)
                }
            }
        } else {
            // move newValue to 0 index of array
            try {
                window.localStorage.setItem(SEARCH_HISTORY_STORE, JSON.stringify([...newValue]))
            } catch (error) {
                console.warn(error)
            }
        }
    }
    return getSearchHistoryStore()
}
