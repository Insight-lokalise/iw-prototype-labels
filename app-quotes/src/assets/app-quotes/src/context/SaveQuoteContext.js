import React, { createContext, useMemo, useState } from 'react'
import { Loading } from '@insight/toolkit-react'
import { getQuote } from '../hooks/getQuote'
import { getTaxAndEWRFee } from '../api/getData'
import {
  fetchProductInformation,
  getAccountInformation,
  saveFreightData,
  saveQuote,
  transformCart,
  getCarrier,
} from '../api'
import getShippingCarriers from '../hooks/getCarriers'

export const SaveQuoteContext = createContext({
  quote: null,
  selectedCarrier: null,
  availableCarriers: null,
  getCarriers: null,
  setShoppingRequest: null,
  fetchProductInformation,
  getAccountInformation,
  getTaxAndEWRFee,
  saveFreightData,
  saveQuote,
  transformCart,
  getCarrier,
})

export const SaveQuoteContextProvider = ({ children }) => {
  const [quoteResponse, quoteLoading, error] = getQuote()
  const [carriers, loadingCarriers, _, getCarriers] = getShippingCarriers([
    quoteResponse,
  ])
  const [shoppingRequest, setShoppingRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  // Set initial shopping request by using either the carrier shopping request or the initial quote
  const initialShoppingRequest = carriers?.shoppingRequest || quoteResponse
  // Set quote to the current state or the initial quote response
  const quote = shoppingRequest || initialShoppingRequest

  if (quoteLoading || error || loadingCarriers) {
    let view = <Loading size="large" />
    if (error) view = <h1 className="u-h3 u-text-bold">{error}</h1>
    return <div className="c-quote-view">{view}</div>
  }

  const enableLoader = async(callback) => {
    setIsLoading(true)
    try {
      await callback()
    } finally {
      setIsLoading(false)
    }
  }

  const updateTaxAndShoppingRequest = async() => {
    // Update tax and ewr data. Updated summary info
    const { data } = await getTaxAndEWRFee()
    // Update the current shopping request using the response from tax and EWR fee
    setShoppingRequest(data)
  }

  const onQuoteUpdate = (quote) => {
    enableLoader(async() => {
      // Update shopping request by updating carriers
      await getCarriers(quote)
      await updateTaxAndShoppingRequest()
    })
  }

  const onCarrierUpdate = async(carrier) => {
    enableLoader(async() => {
      // Call carrier method to update shopping request
      await getCarrier(carrier)
      await updateTaxAndShoppingRequest()
    })
  }

  return (
    <SaveQuoteContext.Provider
      value={{
        quote,
        selectedCarrier: carriers.selectedCarrier,
        availableCarriers: carriers.availableCarriers,
        getCarriers,
        setShoppingRequest,
        fetchProductInformation,
        getAccountInformation,
        getTaxAndEWRFee,
        saveFreightData,
        saveQuote,
        transformCart,
        getCarrier,
        onQuoteUpdate,
        onCarrierUpdate,
        isLoading
      }}
    >
      {children}
    </SaveQuoteContext.Provider>
  )
}
