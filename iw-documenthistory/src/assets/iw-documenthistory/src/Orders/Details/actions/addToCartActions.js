import axios from 'axios'
import { getUTCTimeStamp, getInObject } from '@insight/toolkit-utils'
import addToCartRequest from "@insight/toolkit-utils/lib/helpers/addToCartRequest";
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'

import { addItemToCart } from '../../../models/OrderUtilities/OrderUtilities'
import { addToShoppingRequest } from '../../../api/addToShoppingRequest'

/**
 * Gets the User's Cart from the server session
 * @return {Object} cart object
 */
export function getCart() {
  const timestamp = new Date().getTime()
  return axios.get(`/insightweb/transaction/getcart?_=${timestamp}`).catch(error => {
    console.warn('Failed to fetch cart', error)
    throw error // re-throw error for initial testing of functionality
  }).then(response => {
    return response.data
  })
}

/**
 * Submits a sequence of items to be added to the session's cart.
 * @param {Object} item [{
          clientBrowserDate: window.ToolkitCommon.getUTCTimeStamp(),
          selectedSoftwareContractId: "",
          programId: "",
          previousSearchURL: "",
          materialID: materialId,
          quantity: quantity
      },
      ...
  ];
 */
export function addToCart(item, getDEPInfo, locale, webGroupId) {
  const isLoggedIn = getInObject(window, ["Insight", "isLoggedin"], false);
  const userInfo = getInObject(window, ["Insight", "userInformation"], {});
  const isShoppingReqWGEnabled = userInfo.isCES && window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
  const isLoggedOutDefault = window?.flags['GNA-10394-SHOPPING-CART'] && !isLoggedIn && locale.split("_")[1] === 'US'
  const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, isLoggedOutDefault, isShoppingReqWGEnabled)
  if (isShoppingCartEnabled) {
    return addToCartRequest([item], addToShoppingRequest).then(() => {
      window.postMessage({ type: 'cart:updated' }, window.location.origin)
    })
  } else {
    const cartParamReq = filterCartParam(item, getDEPInfo)
    const cartURL =
      item.type === 'bundle' ? '/insightweb/transaction/addtocartbundle' : '/insightweb/transaction/addtocart'
    return addItemToCart(cartURL, cartParamReq).then(() => {
      window.postMessage({ type: 'cart:updated' }, window.location.origin)
    })
  }
}

// filter the cart request based on contract / bundle / line items etc
export function filterCartParam(item, getDEPInfo) {
  const clientBrowserDate = getUTCTimeStamp()
  const previousSearchURL = 'insightweb/orderHistory'
  const {
    bundleType,
    contractId,
    data,
    isContractActive,
    materialId,
    name,
    programId,
    quantity,
    type,
    sapLineItemNumber,
  } = item

  /**
   * Returns the customerId of the child DEP item.
   * @param  {string} sapLineItemNumber       sapLineItemNumber of the parent
   * @return {object}                         object with customerId property if it exists
   */
  function getCustomerId(sapLineItemNumber) {
    const DEPInfo = getDEPInfo(sapLineItemNumber)
    return DEPInfo && DEPInfo.enrollment && DEPInfo.enrollment.number ? { customerId: DEPInfo.enrollment.number } : {}
  }

  const orderItems =
    type === 'bundle'
      ? data.filter(lineItem => !lineItem.enrollment).map(lineItem => ({
        previousSearchURL,
        configured: lineItem.materialInfo.configured,
        materialID: lineItem.materialInfo.materialId,
        quantity: lineItem.quantity,
        ...getCustomerId(lineItem.sapLineItemNumber),
      }))
      : []

  // Check for contract
  if (contractId) {
    // Check if it is a Contract's bundle or item.
    return type === 'bundle'
      ? {
        bundleType,
        clientBrowserDate,
        name,
        contractID: contractId,
        products: orderItems,
        productsQuantity: quantity,
      }
      : [
        {
          clientBrowserDate,
          previousSearchURL,
          programId,
          quantity,
          contractID: (!contractId.startsWith('0') && isContractActive && contractId) || '',
          materialID: materialId,
          selectedSoftwareContractId: contractId.startsWith('0') ? contractId : '',
          ...getCustomerId(sapLineItemNumber),
        },
      ]
  }
  // Bundle or item that does not belong to a contract.
  return type === 'bundle'
    ? {
      bundleType,
      clientBrowserDate,
      name,
      products: orderItems,
      productsQuantity: quantity,
    }
    : [
      {
        clientBrowserDate,
        previousSearchURL,
        quantity,
        materialID: materialId,
        ...getCustomerId(sapLineItemNumber),
      },
    ]
}
