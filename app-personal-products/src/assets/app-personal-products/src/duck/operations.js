import axios from 'axios'
import { getRegion, getUTCTimeStamp, addToCartGAE } from '@insight/toolkit-utils'

import {
  addItemToCart,
  addToPersonalProducts,
  getPersonalProducts,
  removeFromPersonalProducts,
  updatePersonalProductsSequence,
} from '../api/us'

import {
  addToPersonalProductsSuccess,
  addToPersonalProductsFailure,
  getPersonalProductsSuccess,
  removeFromPersonalProductsSuccess,
  updatePersonalProductsSequenceSuccess,
} from './actions'

import { GET_USERDATA, SAVE_USERDATA } from './types'

export function removeFromPersonalProductsList({id}){
  return dispatch =>
    removeFromPersonalProducts(id).then(()=>{
      dispatch(removeFromPersonalProductsSuccess({id}))
    })
}

/**
 * updates product sequence in redux state and send new product order to API
 * redux state update is not tied to API success to avoid flickering in UI
 * @param productSequence
 * @param productsIDOrder
 * @returns {Function}
 */
export function updatePersonalProductsOrder({productSequence, productsIDOrder,}){
  return dispatch => {
    dispatch(updatePersonalProductsSequenceSuccess(productSequence))
    updatePersonalProductsSequence(productsIDOrder)
  }
}

export function getPersonalProductList() {
  return dispatch =>
    getPersonalProducts().then(({ data }) => {
      if (data.products === null) {
        data.products = {}
      }
      if (data.reference.items === null) {
        data.reference.items = []
      }
      dispatch(getPersonalProductsSuccess(data))
    })
}

export function addToPersonalProductsList(productList) {
  return dispatch =>
    addToPersonalProducts(productList).then(data => {
      dispatch(addToPersonalProductsSuccess(data))
    }).catch(()=>{
      dispatch(addToPersonalProductsFailure(productList))
    })
}

/**
 * Submits a sequence of items to be added to the session's cart.
 * @param {Object} item [{
          clientBrowserDate: getUTCTimeStamp(),
          selectedSoftwareContractId: "",
          programId: "",
          previousSearchURL: "",
          materialID: materialId,
          quantity: quantity
      },
      ...
  ];
 */

export function getCart() {
  const timestamp = new Date().getTime()
	return axios.get(`/insightweb/transaction/getcart?_=${timestamp}`)
		.catch(error => {
			console.warn('Error getting old cart: ' + error)
			throw error
		})
}

export const addToCart= async(item) => {
  const cartParamReq = filterCartParam(item)
  const { data: oldCart } = await getCart()
  const cartURL = '/insightweb/transaction/addtocart'
  return addItemToCart(cartURL, cartParamReq).then((apiData) => {
   const cartData = apiData.data
   const {
    cart: { cartItemsForEmail },
   } = cartData
  const cartItem = cartItemsForEmail?.find(
    (part) => part.materialID == item.materialId
  )
  if (cartItem) {
    const addedCartItem = {
      name: cartItem.description,
      id: cartItem.materialID,
      productSku: cartItem.mfrPartNumber,
      insightPartId: cartItem.materialID,
      price: cartItem.price,
      brand: cartItem.manufacturerName,
      category: cartItem.categoryId,
      quantity: item.quantity || cartItem.quantity,
      currency: cartItem.currency,
      categoryType: "Personal Product List"
    }
    addToCartGAE(oldCart, [addedCartItem]); // add new item to dataLayer
  }
    window.postMessage({ type: 'cart:updated' }, window.location.origin)
  })
}

// filter the cart request based on contract / line items etc
export function filterCartParam(item) {
  const { contractID, materialId, programID, quantity } = item
  return [
    {
      clientBrowserDate: getUTCTimeStamp(),
      selectedSoftwareContractId: contractID && contractID.startsWith('0') ? contractID : '',
      programId: programID || '',
      previousSearchURL: '',
      contractID: contractID && !contractID.startsWith('0') ? contractID : '',
      materialID: materialId,
      quantity,
    },
  ]
}

/**
 * Gets userData from JSP after waiting for it to be fully populated
 * @param  {Object}   userObject window.Insight
 * @return {Action}
 */

export function getUserData(userObject) {
  return dispatch => {
    dispatch({ type: GET_USERDATA })
    dispatch(saveUserData(userObject))
  }
}

/**
 * Save relevant user permissions
 * @param  {Object} userObject window.Insight when fully populated
 * @return {Action}
 */
function saveUserData(userObject) {
  const { userPermissions, userInformation } = userObject
  const isEMEA = getRegion("insight_current_locale") == "EMEA"
  const userData = {
    userPermissions: Array.isArray(userPermissions) ? userPermissions : [],
    isLoggedIn: userObject.isLoggedin,
    isCES: userInformation.isCES,
    isEMEA,
  }
  return { type: SAVE_USERDATA, payload: userData }
}
