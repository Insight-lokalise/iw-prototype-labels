import React, { createContext, useReducer } from 'react'
import {getCurrentLocale} from "@insight/toolkit-utils/lib/helpers";

const QuotesContext = createContext({
  isTop5: true,
  query: null,
  account: null,
  clear: () => {},
  updateQuery: () => {},
  setAccount: () => {},
})

export default QuotesContext


export function QuotesContextProvider({ children }) {
  const locale = getCurrentLocale('insight_current_locale')
  const initialQuery = {
    searchText: '',
    recordsPerPage: 5,
    sortBy: 1,
    sortOrder: 1,
    startPage: 1,
    startDate: '',
    endDate: '',
    locale,
  }
  const [state, dispatch] = useReducer(reducer, {
    isTop5: true,
    query: initialQuery,
    account: null,
    clear,
    setAccount,
    updateQuery,
  })

  function updateQuery(payload) {
    dispatch({ type: 'UPDATE_QUERY', payload })
  }

  function setAccount(account) {
    dispatch({ type: 'SET_ACCOUNT', payload: account })
  }

  function clear() {
    dispatch({ type: 'CLEAR_QUERY', payload: initialQuery})
  }

  return <QuotesContext.Provider value={state}>{children}</QuotesContext.Provider>
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'CLEAR_QUERY':
      return { ...state, query: payload, isTop5: true }
    case 'UPDATE_QUERY':
      return { ...state, query: { ...state.query, ...payload}, isTop5: false }
    case 'SET_QUERY':
      return { ...state, query: payload }
    case 'SET_ACCOUNT':
      return { ...state, account: payload }
    default:
      return state
  }
}
