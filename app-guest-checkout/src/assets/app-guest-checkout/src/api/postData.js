import axios, { POST } from './axiosConfig';
import { RECOMMENDATIONS_PLACEMENT_IDS } from '../constants';
import { getThirdPartyWarranties } from './getThirdPartyWarranties';
import { getRecommendationsData } from './getRecommendation';
import { getSalesOrg } from '../shared/getSalesOrg';

const { rr_warranties, rr_warranties_qa, rr_accessories } = RECOMMENDATIONS_PLACEMENT_IDS;

/* Create user information in the guest checkout flow */

export function createCustomerInfo(postObj) {
  return axios({
    method: POST,
    url: `/gapi/cart/shoppingrequest/user-account-info`,
    data: postObj,
  })
    .catch((error) => {
      console.warn(`Failed to create customer information`, error)
      throw error
    })
    .then(({ data }) => data)
}

/* This API decides, which page to redirect based on sellRequirements (LineLevelInfo page / ShipBill page) */

export async function fetchPopulateUIFlags(shoppingRequestObj) {
  try {
    return await axios({
      method: POST,
      url: 'gapi/checkout/populate-ui-flags',
      data: { ...shoppingRequestObj },
    })
  } catch (error) {
    console.warn('Failed to get UI flags', error)
  }
}

/* This API updated line level data that includes all sellRequirements & country of usage */

export async function updateLineLevelInfo(payloadObj) {
  try {
    return await axios({
      method: POST,
      url: 'gapi/cart/shoppingrequest/cartitems/metadata/update',
      data: payloadObj,
    })
  } catch (e) {
    console.warn('Failed to update linelevel info', error)
  }
}

/* API to split the items when the qty is > 1 */

export async function split(postObj) {
  return await axios({
    method: POST,
    url: `/gapi/cart/shoppingrequest/split`,
    data: postObj,
  })
    .catch((error) => {
      console.warn(`Failed to split item`, error)
      throw error
    })
    .then(({ data }) => data)
}

export async function postShoppingRequest(
  shoppingRequest,
  lineLevelSessionInfos,
  clientBrowserDate
) {
  const payload = {
    shoppingRequest,
    lineLevelSessionInfos,
    clientBrowserDate,
  }
  return await axios
    .post('insightweb/synch', payload)
    .catch((error) => {
      console.warn('Failed to post shopping request', error)
      throw error
    })
    .then(({ data }) => data)
}

export const getPlacements = async (materialId, isLoggedIn, locale) => {
  try {
    const placementids = document.domain === 'www.insight.com'
      ? `${rr_warranties}|${rr_accessories}`
      : `${rr_warranties_qa}|${rr_accessories}`;
    const request = {
      placementids,
      productId: materialId,
      loggedin: isLoggedIn,
      locale,
      salesOrg: await getSalesOrg(),
    };
    const placements = await getRecommendationsData(request);
    const accessories = placements[rr_accessories];
    const protection = placements[rr_warranties_qa] || placements[rr_warranties];

    return {
      accessories: accessories?.prodList || [],
      manufacturerWarranties: protection?.prodList || []
    }
  } catch (err) {
    console.warn(`Failed to fetch Placements: `, err);
    return {};
  }
}

export const addToShoppingRequest = async ({
  materialId,
  isLoggedIn,
  locale,
  shoppingRequest,
  lineLevelSessionInfos,
  invalidMaterialIds,
}) => {
  try {
    const [
      recommendationsData,
      thirdPartyWarranties
    ] = await Promise.all([
      getPlacements(materialId, isLoggedIn, locale),
      getThirdPartyWarranties(materialId)
    ]);
    const {
      accessories = [],
      manufacturerWarranties = []
    } = recommendationsData;
    const hasAccessories = accessories?.length > 0;
    const hasWarranties = manufacturerWarranties?.length > 0 || thirdPartyWarranties?.length > 0;

    const materialList = [
      {
        accessories: hasAccessories,
        contractId: '',
        materialId,
        quantity: 1,
        warranties: hasWarranties,
      },
    ]

    const reqObj = {
      browseAll: true,
      contractId: '',
      locale,
      materialList,
      shoppingRequest:
        shoppingRequest && Object.keys(shoppingRequest).length > 0 ? shoppingRequest : null,
      lineLevelSessionInfos,
      invalidMaterialIds,
    }
    const response = await axios({
      method: 'post',
      url: '/gapi/cart/shoppingrequest/cartitems',
      data: reqObj,
    })
    if (!response.data) throw new Error('Error adding product(s) to cart')
    return response.data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to add items to shoppingRequest`, err)
    throw err
  }
}

export const changeWarrantyToShoppingRequest = async ({
  parentId,
  materialId,
  locale,
  shoppingRequest,
  lineLevelSessionInfos,
}) => {
  const {
    cart: { cartItems },
  } = shoppingRequest
  const cartItem = cartItems.find((part) => part.id === parentId)
  const parentItemQuantity = cartItem?.quantity
  try {
    const materialList = [
      {
        accessories: false,
        contractId: '',
        parentId,
        warranties: false,
        warrantyMaterialId: materialId,
        warrantyQuantity: parentItemQuantity,
      },
    ]

    const reqObj = {
      browseAll: true,
      contractId: '',
      locale,
      materialList,
      shoppingRequest,
      lineLevelSessionInfos,
    }
    const response = await axios({
      method: 'post',
      url: '/gapi/cart/shoppingrequest/cartitems',
      data: reqObj,
    })
    if (!response.data) throw new Error('Error adding product(s) to cart')
    return response.data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to add items to shoppingRequest`, err)
    throw err
  }
}

export const updateShoppingRequest = async ({
  localQuantity,
  materialId,
  id,
  shoppingRequest,
  lineLevelSessionInfos,
}) => {
  const reqObj = {
    items: [
      {
        id,
        quantity: localQuantity,
      },
    ],
    shoppingRequest,
    lineLevelSessionInfos,
  }

  try {
    const response = await axios({
      method: POST,
      url: '/gapi/cart/shoppingrequest/cartitems/update',
      data: reqObj,
    })
    //addToCartGAEAction(shoppingRequest, localQuantity, materialId)
    if (!response.data) throw new Error('Error adding product(s) to cart')
    return response.data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to add items to shoppingRequest`, err)
    throw err
  }
}

export const deleteShoppingRequest = async ({
  id,
  shoppingRequest,
  lineLevelSessionInfos,
  isEmptyCartDelete,
  isWarranty,
}) => {
  const items = !!isEmptyCartDelete
    ? []
    : [
        {
          id,
          quantity: 0,
        },
      ]

  const deleteUrl = !!isWarranty
    ? '/gapi/cart/shoppingrequest/cartitems/deletewarranty'
    : '/gapi/cart/shoppingrequest/cartitems/delete'

  const reqObj = {
    items,
    shoppingRequest,
    lineLevelSessionInfos,
  }

  try {
    const response = await axios({
      method: POST,
      url: deleteUrl,
      data: reqObj,
    })
    //removeFromCartGAEAction(shoppingRequest, id, isWarranty)
    if (!response.data) throw new Error('Error adding product(s) to cart')
    return response.data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to add items to shoppingRequest`, err)
    throw err
  }
}

export const checkoutFn = async ({
  depState,
  locale,
  enrollmentParentIds,
  shoppingRequest,
  lineLevelSessionInfos,
}) => {
  try {
    let materialList = []
    const normalizedShoppingRequest = shoppingRequest?.cart?.cartItems?.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur }),
      {}
    )
    const normalizeLineLevelSessionInfos = lineLevelSessionInfos.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur }),
      {}
    )
    enrollmentParentIds.map((enrollmentParentId) => {
      const quantity = normalizedShoppingRequest[enrollmentParentId].quantity
      const childEnrollmentId =
        normalizedShoppingRequest[enrollmentParentId].materialInfo
          ?.childEnrollmentId
      const materialId =
        normalizeLineLevelSessionInfos[enrollmentParentId].enrollmentMaterialId //Apple-DEP
      const currentState = depState[enrollmentParentId]
      if (!currentState?.customerID) {
        materialList.push({
          id: childEnrollmentId,
        })
      } else {
        const reqObj = !!childEnrollmentId
          ? {
              id: childEnrollmentId,
              enrollmentId: currentState?.customerID,
            }
          : {
              parentId: enrollmentParentId,
              materialId,
              quantity,
              enrollmentId: currentState?.customerID,
            }

        materialList.push(reqObj)
      }
    })

    const reqObj = {
      locale,
      materialList,
      shoppingRequest,
      lineLevelSessionInfos,
    }

    const response = await axios({
      method: POST,
      url: '/gapi/cart/enrollment',
      data: reqObj,
    })
    return response.data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to copy to all items`, err)
    throw err
  }
}

/**
 * This api might be called twice, the likely scenarios are as follows:
 *** Scenario 1 ***. 
     When we make the initial call to SAP to validate the address, SAP returns both the inputted address and a suggested address.
     SAP sees the suggested address as the ONLY valid address.
     if the user selects the inputted address a second call will be made to SAP at which point SAP returns a message ADDRESS_VERIFICATION_FAILED.
     The user cannot proceed to the next section (shipping options) or next page (Review Order page) for Shipping and Billing sections respectively.
     However, if the user selects the suggested address no further validation call is made and shoppingRequest obj is updated with the address.
 *** Scenario 2 ***
     if the user provides an address with valid state, city, postalcode as well as country and insist on selecting this address in the suggested modal,
     when we try adding it to shoppingReq object a second call is made. Although the address is valid, SAP still returns ADDRESS_VERIFICATION_FAILED msg and the user cannot proceed.
     The temporary workaround is to compare if the state, city, country and postalcode matches with the ones provided by SAP, if they match no further validation is done, the address
     is saved to shoppingReq obj and the user can proceed.
     NOTE - The potential issue with this approach is when we expand the GCO feature to other sales org with more than 5 digit postalcode (eg Canada) at which point UI changes will be required.
 * @param {Object} address 
 * @returns {Object} data that contains both inputted address and SAP suggested address
 */
export async function validateGuestAddress(address) {
  const defaultBody = {
    address1: '',
    address2: '',
    city: '',
    region: '',
    country: '',
    suiteorstore: '',
    postalcode: '',
    addressAlreadyVerified:false
  }
  try {
    const { data } = await axios({
      method: POST,
      url: '/gapi/sap/guest/address/validate',
      data: { 
              ...address,
              inputAddress:{
                ...defaultBody,
                address1: address?.inputAddress?.street1,
                address2: address?.inputAddress?.street2,
                city: address?.inputAddress?.city,
                region: address?.inputAddress?.state,
                country: address?.inputAddress?.country,
                postalcode: address?.inputAddress?.zipCode,
                addressAlreadyVerified:address?.inputAddress?.addressAlreadyVerified
              }
            },
    })
    return data
  } catch (err) {
    console.warn(`Failed to validate address`, err)
    throw err
  }
}

export async function getShippingCarriers(shoppinRequestObject) {
  try {
    const { data } = await axios({
      method: POST,
      url: `/insightweb/shipbillpay/carrier-options`,
      data: shoppinRequestObject,
    })
    if (!data?.carriers?.length && !data?.slsCarriers?.length ){
      console.warn('Error fetching carriers')
      throw new Error('Error fetching carriers')
    }
    return data
  } catch (e) {
    console.warn('Error fetching carriers', e)
    throw e
  }
}
export function saveCartAsList({ name, shoppingRequest, userId }) {
  return axios({
    method: 'post',
    url: `gapi/saved-cart/user/${userId}/save-cart`,
    data: {shoppingRequest, name},
  }).catch((error) => {
    console.warn(`Failed to save cart as list`, error)
    throw error
  })
}

/*
 * Gets the new paymetric iframe URL for 3DS2 card screening
 * params id: enable3DS {boolean}, redirectUrl {string}, cvvRequired {boolean}, hostUri, cssUri when fetching iframe for new card, (id is 0)
 * @return {Object}
 * */
export function fetchPM3DSFrame(pmRequest) {
  return axios({
    method: 'post',
    url: '/insightweb/paymetrics-3ds-iFrame',
    data: pmRequest,
  }).catch((error) => {
    console.warn(`Failed to fetch paymetrics Iframe`, error)
    throw error
  }).then(({data})=>data)
}

/*
 * Fetches a new web reference number for 3DS2 order
 * @return number
 * */
export function fetchWebRefNumber(payload={}) {
  return axios({
    method: 'post',
    url: '/insightweb/paymetrics-web-reference',
    data: payload,
  }).catch((error) => {
    console.warn(`Failed to get web reference number`, error)
    throw error
  })
}

/*
 * Gets ISO code mapping
 * params { currencyCodes: Array, countryCodes: Array }
 * @return {Object}
 * */
export function fetchIsoCodes(payload) {
  return axios({
    method: 'post',
    url: '/insightweb/get-iso-codes',
    data: payload,
  }).catch((error) => {
    console.warn(`Failed to fetch ISO codes`, error)
    throw error
  })
}

/*
 * Gets the 3DS2 authorization results of submitted card data
 * params payload: { accessToken, cvvRequired, enable3DS, cvv }
 * @return {Object}
 * */
export function submit3DSPayMetricData(pmRequest) {
  return axios({
    method: 'post',
    url: '/insightweb/paymetrics-3ds-token',
    data: pmRequest,
  }).catch((error) => {
    console.warn(`Failed to fetch paymetrics token`, error)
    throw error
  }).then(({data})=>data)

}


/*
 * Take shopping request from UI and validate it and make sure it is valid before submitting order
 * */
export function validateShoppingRequest(payload) {
  if (window.flags && window.flags['GNA-11542-UPFRONT-SR-VALIDATION']) {
    return axios({
      method: 'post',
      url: 'gapi/cart/shoppingrequest/validate-shopping-request',
      data: payload,
    }).catch((error) => {
      console.warn(`Failed to verify shopping request`, error)
      throw error
    }).then(({data})=>data)
  } else {
    return {
       "shoppingRequest" : payload.shoppingRequest,
       "validShoppingRequest" : true
    }
  }
}

/*
 * Place order API
 * */
export async function placeOrder(payload) {
    const resp = await _placeOrder(payload)
    await _invalidatePaymetricsWebRef()
    return resp
}

function _placeOrder(payload) {
  return axios({
    method: 'post',
    url: 'gapi/order/save-document',
    data: payload,
  }).catch((error) => {
    console.warn(`Failed to place order`, error)
    throw error
  }).then(({data})=>data)
}

function _invalidatePaymetricsWebRef() {
  return axios({
    method: 'post',
    url: 'insightweb/paymetrics-web-reference/invalidate',
  }).catch((error) => {
    console.warn(`Failed to invalidate the webreference number`, error)
    throw error
  })
}

export function savePaymentToShoppingRequest(
  shoppingRequest,
  lineLevelSessionInfos,
  request
) {
  const payload = {
    request,
    shoppingRequest,
    lineLevelSessionInfos,
  }
  return axios({
    method: 'post',
    url: 'gapi/checkout/shoppingrequest/billing',
    data: payload,
  }).catch((error) => {
    console.warn(`Failed to save payment`, error)
    throw error
  }).then(({data})=>data)
}


/*
 * Updates shoppingRequest with request (shipping/billing)
 * params { shoppingRequest:Object, lineLevelSessionInfos:Object, request:JSON literals, type (shipping or billing) }
 * @return {Object}
 * */
export function saveAddress(
  shoppingRequest,
  lineLevelSessionInfos,
  request,
  type
) {
  const payload = {
    request,
    shoppingRequest,
    lineLevelSessionInfos,
  }
  try {
    return axios({
      method: POST,
      url: `gapi/checkout/shoppingrequest/${type}`,
      data: payload,
    })
  } catch (err) {
    console.warn(`Failed to save ${type} address`)
    throw err
  }
}
export default addToShoppingRequest

export const fetchNextStep = async ({ source, quickCheckoutRequested, shoppingRequest, lineLevelSessionInfos }) => {
  const response = await axios({
    method: POST,
    url: `/gapi/checkout/nextstep?source=${source}&quickCheckoutRequested=${quickCheckoutRequested}`,
    data:  {
      shoppingRequest,
      lineLevelSessionInfos
    }
  })
  return response?.data
}