import React, { createContext } from 'react'
import { Loading } from '@insight/toolkit-react'
import { useQuoteDetails } from '../hooks/useQuoteDetails'
import { getAccountInformation } from '../api'

export const QuoteDetailsContext = createContext({
  quoteDetails: null,
})

export const QuoteDetailsContextProvider = ({ children }) => {
  const [quoteDetails, loading, error] = useQuoteDetails()

  if (loading || error) {
    let view = <Loading size="large" />
    if (error) view = <h1 className="u-h3 u-text-bold">{error}</h1>
    return <div className="c-quote-view">{view}</div>
  }

  return (
    <QuoteDetailsContext.Provider value={{ quoteDetails, getAccountInformation }}>
      {children}
    </QuoteDetailsContext.Provider>
  )
}
