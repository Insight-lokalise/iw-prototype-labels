import React from 'react'
import { getCompareSimilar } from '../hooks/useCompareSimilar'


/** CompareSimilar Context */
export const CompareSimilarContext = React.createContext({
  similarProducts: null,
})
CompareSimilarContext.displayName = 'CompareSimilar'

/** CompareSimilar Context Provider
 *
 * Renders a provider containing the current state of compare similar products
 * */
export const CompareSimilarProvider = (props) => {

  const [similarProducts] = getCompareSimilar()
  return (
    <CompareSimilarContext.Provider value={{ similarProducts }}>
      {props.children}
    </CompareSimilarContext.Provider>
  )
}
