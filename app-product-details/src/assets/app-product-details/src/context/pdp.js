import React, { useState } from 'react'
import { Loading } from '@insight/toolkit-react'
import { getCurrentLocale, isEmeaRegion, getWebPrice } from '@insight/toolkit-utils'
import { addToCart } from '../api/addToCart'
import { sendSignal } from '../api/sendSignal'
import { sendTracking } from '../api/sendTracking'
import { getProductReviews } from '../api/getProductReviews'
import { getProduct } from '../hooks/useProduct'
import { getPersonalProductLists } from '../hooks/usePersonalProductLists'
import { getPropCompliance } from '../hooks/usePropCompliance'


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
  addToCart: null,
  /** Material id for the selected mini PDP */
  miniPDP: null,
  /** Method to set the selected material id for mini PDP */
  setMiniPDP: null,
  /** Method to get the prop 65 verbaige for the current material*/
  getPropCompliance: null,
  /** Method to send signal */
  sendSignal: null,
  /** Method to send tracking */
  sendTracking: null,
  /** Method to get product reviews. Not to be confused with reviews context */
  getProductReviews: null,
  /** Flag to check whether the current region is EMEA or not */
  showVAT: false,
})
PDPContext.displayName = 'PDP'

/** PDP Context Provider
 *
 * Renders the current state of the get product hook and add the response to the context
 * */
export const PDPProvider = (props) => {
  const [pdp, isLoggedIn, loading, error] = getProduct();
  const [personalProductLists] = getPersonalProductLists();
  const [miniPDP, setMiniPDP] = useState(null);
  const [contractId, setContractId] = useState('')
  const isEMEA = isEmeaRegion();
  // Currently only EMEA region will show VAT
  const showVAT = isEMEA;

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
    } = pdp;

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
          price: price?.webPrice,
        },
      },
    })

    return props.children
  }
  return (
    <PDPContext.Provider
      value={{
        ...pdp,
        contractId,
        setContractId,
        personalProductLists,
        isLoggedIn,
        overview: pdp?.product?.overview,
        addToCart,
        miniPDP,
        setMiniPDP,
        getPropCompliance,
        sendSignal,
        sendTracking: processTracking,
        getProductReviews,
        showVAT,
      }}
    >
      {renderProductDetails()}
    </PDPContext.Provider>
  )
}

export default PDPContext
