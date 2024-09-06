import axios, { GET, POST } from './axiosConfig'
import { getUTCTimeStamp } from '@insight/toolkit-utils'
import {
  getPersistCheckoutFromStorage,
  setPersistCheckoutFromStorage
} from '@insight/toolkit-utils/lib/helpers/storageHelpers'

/** Convert Quote to Order API
 *
 *  @param {string} quoteNumber
 */
export const convertQuoteToOrder = async (quoteNum, opportunityId) => {
  return axios({
    method: POST,
    url: `insightweb/transaction/purchaseitemstocart`,
    data: {
      quoteNumber: quoteNum,
      opportunityId,
      clientBrowserDate: getUTCTimeStamp(),
    },
  })
    .then(({ data }) => (window.location = '/insightweb/viewCart'))
    .catch((error) => {
      if (error.response.status === 404) {
        window.location.href = '/insightweb/404'
      }
      console.warn(`Failed to convert quote`, error)
      throw error
    })
}

/** Convert Quote to Order API with new shoppingReq
 *
 *  @param {string} quoteNumber
 */
export const convertQuoteToOrderShoppingReq = async (quote) => {
  const shoppingReqFromStorage = getPersistCheckoutFromStorage()

  return axios({
    method: POST,
    url: `/insightweb/transaction/load-from-quote`,
    data: {
      quoteNumber: quote?.header?.quoteNumber,
      opportunity: quote?.header?.opportunityId,
      clientBrowserDate: getUTCTimeStamp(),
    },
  })
    .then(({ data }) => {
      setPersistCheckoutFromStorage(
        'persist:checkout',
        JSON.stringify({
          ...shoppingReqFromStorage,
          shoppingRequest: JSON.stringify(data.shoppingRequest),
          lineLevelSessionInfos: JSON.stringify(data.lineLevelSessionInfos),
          invalidIds: JSON.stringify(data.invalidIds),
          overriddenFreightDetails: JSON.stringify(
            data.overriddenFreightDetails
          ),
        })
      )
      window.postMessage({ type: 'cart:add' }, window.location.origin)
      window.location = '/insightweb/cart'
    })
    .catch((error) => {
      if (error.response.status === 404) {
        window.location.href = '/insightweb/404'
      }
      console.warn(`Failed to convert quote`, error)
      throw error
    })
}

export default {
  convertQuoteToOrder,
  convertQuoteToOrderShoppingReq,
}
