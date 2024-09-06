import React, { useState } from 'react'
import { Loading } from '@insight/toolkit-react'
import { getCurrentLocale } from '@insight/toolkit-utils'
import { getProduct } from '../hooks/useProduct'
import { getProductReviews } from '../api/getProductReviews'
import { sendTracking } from '../api/sendTracking'


/** PDP Context
 * Used to store the state of the current pdp */
export const PDPContext = React.createContext({
  /** Object containing the details of the selected product */
  product: null,
  /** Overview override displayed before CNET scrip  */
  overview: null,
  /** Array of product specifications */
  specifications: null,
  /** Array of product variants */
  variants: null,
  /** Method to add the selected product(s) to cart */
  /** Method to send tracking */
  sendTracking: null,
  /** Method to get product reviews. Not to be confused with reviews context */
  getProductReviews: null,
  setHasCNETData:()=>{},
  hasCNETData: false
})
PDPContext.displayName = 'PDP'

/** PDP Context Provider
 *
 * Renders the current state of the get product hook and add the response to the context
 * */
export const PDPProvider = (props) => {
  const [pdp, loading, error] = getProduct()

  const [hasCNETData, setHasCNETData] = useState(false);

  const processTracking = (data) => sendTracking(pdp, data)
  const renderProductDetails = () => {
    if (loading || error) {
      if (error) {
        const locale = getCurrentLocale('insight_locale')
        // Redirect to product 404 page
        window.location = `/${locale}/product-404.html`
      }
      return (
        <div className="c-pdp-page__view">
          <Loading />
        </div>
      )
    }

    const {
      product: { category, price, manufacturer, descriptions, materialId },
    } = pdp

    window.fireTagEvent('pdp', {
      ecommerce: {
        scEvent: 'prodView',
        currencyCode: price?.currency,
        productInfo: {
          brand: manufacturer?.name,
          category: category?.code,
          productSku: manufacturer?.partNumber,
          insightPartId: materialId,
          name: descriptions.shortDescription,
          price: price.listPrice,
        },
      },
    })

    return props.children
  }

  return (
    <PDPContext.Provider
      value={{
        ...pdp,
        overview: pdp?.product?.overview, hasCNETData, setHasCNETData,
        sendTracking: processTracking,
        getProductReviews,
      }}
    >
      {renderProductDetails()}
    </PDPContext.Provider>
  )
}

export default PDPContext
