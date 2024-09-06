import { combineReducers } from 'redux'

import accountsByRegion from './accountsByRegionReducer'
import genericOrderHistoryResults from './genericOrderHistoryResults'
import searchOrdersPagination from './searchOrdersPaginationReducer'
import simpleSearchResults from './simpleSearchResultsReducer'
import simplifiedSearch from './simplifiedSearchReducer'

export default combineReducers({
  accountsByRegion,
  genericOrderHistoryResults,
  searchOrdersPagination,
  simpleSearchResults,
  simplifiedSearch,
})
