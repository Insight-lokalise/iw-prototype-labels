import React, { createContext, useReducer } from 'react'
import {getCurrentLocale} from "@insight/toolkit-utils/lib/helpers";
import {endDate, startDate} from './../constants'

const InvoicesContext = createContext({
  query: null,
  clear: () => {},
  updateQuery: () => {},
})

export default InvoicesContext


export function InvoiceContextProvider({ children }) {
  const locale = getCurrentLocale('insight_current_locale')
  const initialQuery = {
    searchText: '',
    recordsPerPage: 5,
    sortBy: 1,
    sortOrder: 1,
    startPage: 1,
    startDate,
    endDate,
    locale,
  }
  const [state, dispatch] = useReducer(reducer, {
    query: initialQuery,
    isInit: true,
    clear,
    updateQuery,
  })

  function updateQuery(payload) {
    dispatch({ type: 'UPDATE_QUERY', payload })
  }

  function clear() {
    dispatch({ type: 'CLEAR_QUERY', payload: initialQuery })
  }

  return <InvoicesContext.Provider value={state}>{children}</InvoicesContext.Provider>
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'CLEAR_QUERY':
      return { ...state, query: payload, isInit: true }
    case 'UPDATE_QUERY':
      return { ...state, query: { ...state.query, ...payload}, isInit: false }
    default:
      return state
  }
}
