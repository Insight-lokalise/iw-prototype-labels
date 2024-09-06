import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import getSearchHistoryStore from '../api/common/getSearchHistoryStore'

import { getSearchSuggestions } from 'api'

const SearchContext = createContext({
  query: null,
  setQuery: () => {},
})

export default SearchContext

export function SearchContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    query: '',
    suggestions: null,
    getSuggestions,
    setQuery,
    setSuggestions,
  })

  function setQuery(query = '') {
    dispatch({ type: 'SET_QUERY', payload: query })

    getSuggestions(query)
  }

  function getSuggestions(query) {
    const promise = query ? getSearchSuggestions(query) : getSearchHistoryStore()     
    promise.then((props) => {
      setSuggestions(props?.results)
    })
  }

  function setSuggestions(suggestions) {
    dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions })
  }

  return <SearchContext.Provider value={state}>{children}</SearchContext.Provider>
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

SearchContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
