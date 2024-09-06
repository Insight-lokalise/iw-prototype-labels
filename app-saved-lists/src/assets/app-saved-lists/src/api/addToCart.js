import axios, { POST } from './axiosConfig'
import {
  getPersistCheckoutFromStorage,
  setPersistCheckoutFromStorage
} from "@insight/toolkit-utils/lib/helpers/storageHelpers";

export const addToCart = async (loginId, cartId) => {
  const checkoutStorage = getPersistCheckoutFromStorage()
  const { shoppingRequest= {}, lineLevelSessionInfos= null, invalidMaterials=[] } = checkoutStorage
  return axios({
    method: 'post',
    url: `gapi/saved-cart/user/${loginId}/save-cart/load-cart`,
    data: {
      shoppingRequest: shoppingRequest === null ? {} : shoppingRequest,
      lineLevelSessionInfos,
      invalidMaterials,
      cartId,
    },
  }).then(({data})=>{
    setPersistCheckoutFromStorage('persist:checkout',{
      ...checkoutStorage,
      shoppingRequest: JSON.stringify(data?.shoppingRequest) || {},
      lineLevelSessionInfos: JSON.stringify(data?.lineLevelSessionInfos) || null,
      invalidMaterials: JSON.stringify(data?.invalidMaterials) || [],
    })
    window.postMessage({ type: 'cart:updated' }, window.location.origin);
  }).catch(error => {
    console.warn(`Failed to save cart as list`, error)
    throw error
  })
}

export default {
  addToCart,
}
