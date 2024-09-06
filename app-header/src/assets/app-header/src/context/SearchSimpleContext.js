import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import debounce from '@insight/toolkit-utils/lib/timing/debounce'
import getSearchHistoryStoreSimple from '../api/common/getSearchHistoryStoreSimple'
import {
  getLWSearch,
  getSearchSuggestionsSimple,
} from 'api'

const SearchSimpleContext = createContext({
  query: null,
  setQuery: () => {},
  suggestions: null,
  getSuggestions: () => {},
  getLWSearch,
})

export default SearchSimpleContext

export function SearchSimpleContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    query: '',
    suggestions: null,
    getSuggestions,
    setQuery,
    setSuggestions,
    getLWSearch,
  })

  function setQuery(query = '', contract) {
    dispatch({ type: 'SET_QUERY', payload: query })
    onQueryChange({ query, contract })
  }

  const onQueryChange = debounce(({ query,  contract }) => {
    getSuggestions(query, contract)
  }, 250)

  function getSuggestions(query, contract) {
    const promise =
      query && query.length > 1
        ? getSearchSuggestionsSimple(query, contract)
        : getSearchHistoryStoreSimple()
    if (promise !== undefined) {
      promise.then((data) => {
        const tempData = data
        tempData.signalMetaData = JSON.stringify({
          fusionQueryId: data?.fusionQueryId || '',
          origParams: data?.origParams || '',
        })
        setSuggestions(tempData)
      }).catch((error)=>{
        console.warn(`request got ${error.message}`)
      })
    }
  }

  function setSuggestions(suggestions) {
    dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions })
  }

  return (
    <SearchSimpleContext.Provider value={state}>
      {children}
    </SearchSimpleContext.Provider>
  )
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'SET_QUERY':
      return { ...state, query: payload }
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: payload }
    default:
      return state
  }
}

SearchSimpleContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
