import React from 'react'
import { Loading } from '@insight/toolkit-react'
import { addToCart } from '../api/addToCart'
import { sendSignal } from '../api/sendSignal'
import { getCompare } from '../hooks/useCompareProducts'

/** Compare Context */
export const CompareSimilarContext = React.createContext({
  similarProducts: null,
  /** Method to add the selected product(s) to cart */
  addToCart: null,
  /** Method to send signal */
  sendSignal: null,
})
CompareSimilarContext.displayName = 'CompareSimilarContext'

/** Compare Context Provider
 *
 * Renders a provider containing global Compare functionality
 * */
export const CompareProvider = (props) => {
  const [similarProducts, loading, error] = getCompare()
  if (loading || error) {
    let view = (
      <div>
        <Loading />
      </div>
    )

    if (error) view = <div>{error}</div>
    return <div className="c-compare-similar__view">{view}</div>
  }
  return (
    <CompareSimilarContext.Provider
      value={{ addToCart, similarProducts, sendSignal }}
    >
      {props.children}
    </CompareSimilarContext.Provider>
  )
}
