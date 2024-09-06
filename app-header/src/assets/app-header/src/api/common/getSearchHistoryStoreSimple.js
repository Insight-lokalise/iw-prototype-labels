import { SEARCH_HISTORY_STORE_SIMPLE } from './updateSearchHistoryStoreSimple'

export default function getSearchHistoryStoreSimple() {    
    const storePromise = (window.localStorage.getItem(SEARCH_HISTORY_STORE_SIMPLE)) 
    ? Promise.resolve(window.localStorage.getItem(SEARCH_HISTORY_STORE_SIMPLE))
    : Promise.resolve([])    

     return storePromise.then((searchHistory) => {
        if(searchHistory.length !== 0) {
            return {
                suggestions: (JSON.parse(searchHistory)).map(({value}) => ({
                    value,
                }))
            }
        }
    })    
}