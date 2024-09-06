import getSearchHistoryStoreSimple from './getSearchHistoryStoreSimple'

export const SEARCH_HISTORY_STORE_SIMPLE = 'searchHistoryStoreSimple'

export default function updateSearchHistoryStoreSimple(searchTerm) {
    addToSearchHistoryStore(searchTerm)

    function addToSearchHistoryStore(searchTerm) {
        const newValue = [{ value: searchTerm }]

        const searchHistoryResult = window.localStorage.getItem(SEARCH_HISTORY_STORE_SIMPLE);
        const searchHistoryResultStatus = searchHistoryResult && (searchHistoryResult !== null || searchHistoryResult !== "" || typeof searchHistoryResult === "string" && searchHistoryResult.trim().length !== 0)

        if (searchHistoryResultStatus) {
            const prevSearchHistory = JSON.parse(window.localStorage.getItem(SEARCH_HISTORY_STORE_SIMPLE))
            const storeDoesNotAlreadyContainValue = prevSearchHistory.filter(bite => bite.value === searchTerm).length === 0

            // To store only 5 most recent searches in searchHistoryStoreSimple
            if (storeDoesNotAlreadyContainValue) {
                const fiveMostRecentSearches = prevSearchHistory.slice(0, 4)
                try {
                    window.localStorage.setItem(SEARCH_HISTORY_STORE_SIMPLE, JSON.stringify([...newValue, ...fiveMostRecentSearches]))
                } catch (error) {
                    console.warn(error)
                }
            } else {
                const storeWithNewValueFilteredOut = prevSearchHistory.filter(bite => bite.value !== searchTerm)
                try {
                    window.localStorage.setItem(SEARCH_HISTORY_STORE_SIMPLE, JSON.stringify([...newValue, ...storeWithNewValueFilteredOut]))
                } catch (error) {
                    console.warn(error)
                }
            }
        } else {
            // move newValue to 0 index of array
            try {
                window.localStorage.setItem(SEARCH_HISTORY_STORE_SIMPLE, JSON.stringify([...newValue]))
            } catch (error) {
                console.warn(error)
            }
        }
    }
    return getSearchHistoryStoreSimple()
}
