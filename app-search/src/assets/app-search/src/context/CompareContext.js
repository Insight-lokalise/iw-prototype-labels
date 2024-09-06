import React, { createContext, useMemo, useState } from 'react'

/** Compare Context
 * Used to store the search compare state */
export const CompareContext = createContext({
  /** Object of selected products */
  compare: null,
  /** Array of selected products */
  products: null,
  /** Method to add the selected product to compare */
  addProduct: null,
  /** Method to remove the selected product from compare */
  removeProduct: null,
  /** Method to remove all compare products */
  clearAll: null,
})

/** Compare Context Provider
 *
 * Renders the current state of products to compare
 * */
export const CompareProvider = ({ children }) => {
  const [compare, setCompare] = useState(() => {
    // Check local storage for compare
    const compareSession = window.localStorage.getItem('search_compare')
    // Return the parsed compareSession object
    if (compareSession) return JSON.parse(compareSession)
    return null
  })
  /** Add product to compare state object */
  const addProduct = (product) => {
    // Create a key(control object sort order)
    const key = `c-${product.materialId}`
    // Check if product is already selected
    if (compare?.[key]) {
      removeProduct(product.materialId)
      return
    }
    // Check if the maximum of 4 products is selected
    if (compare && Object.keys(compare)?.length === 4) return null
    // Update compare object with the selected product
    const update = {
      ...compare,
      [key]: {
        materialId: product.materialId,
        manufacturerName: product.manufacturerName,
        manufacturerPartNumber: product.manufacturerPartNumber,
        description: product.description,
        image: product.image,
        price: product.price,
      },
    }
    setCompare(update)
    // Update compare local storage
    window.localStorage.setItem('search_compare', JSON.stringify(update))
  }
  /** Remove the selected material from compare */
  const removeProduct = (materialId) => {
    const key = `c-${materialId}`
    const update = { ...compare }
    // Remove the selected material
    delete update[key]
    setCompare(update)
    // Update compare local storage
    window.localStorage.setItem('search_compare', JSON.stringify(update))
  }
  /** Remove all materials in compare state */
  const clearAll = () => {
    setCompare(null)
    // Remove compare local storage key
    window.localStorage.removeItem('search_compare')
  }
  // Memoize the conversion of compare object to array of products
  const products = useMemo(
    () => (compare ? Object.values(compare) : []),
    [compare]
  )
  return (
    <CompareContext.Provider
      value={{
        products,
        compare,
        addProduct,
        removeProduct,
        clearAll,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}
