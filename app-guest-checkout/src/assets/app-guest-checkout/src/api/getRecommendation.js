import axios, { POST } from './axiosConfig'
import { RECOMMENDATIONS_PLACEMENT_IDS } from '../constants'
import {
  getThirdPartyWarranties,
  convertToProductWarranty,
} from './getThirdPartyWarranties'
import { getSalesOrg } from '../shared/getSalesOrg'

/*export const addToCart = async (item) => {
  // in search page add to cart method is only called with one item at a time, so moving analytics logic in here
  try {
    // get current cart before adding item, needed for tracking / analytics purpose
    const { data:oldCart } = await getCart()

    const { data } = await axios({
      method: POST,
      url: `/insightweb/transaction/addtocart`,
      data: item,
    })
    if (!data) throw new Error('Error adding product(s) to cart')
    // successfully added item // report to datalayer
    const {cart:{cartItemsForEmail}} = data
    const cartItem = cartItemsForEmail.find(part => part.materialID==item[0].materialID)
    const addedCartItem = {
      name: cartItem.description,
      id: cartItem.materialID,
      productSku: cartItem.mfrPartNumber,
      insightPartId: cartItem.materialID,
      price: cartItem.price,
      brand: cartItem.manufacturerName,
      category: cartItem.categoryId,
      quantity: item[0].quantity || cartItem.quantity,
      currency: cartItem.currency,
    }
    if (addedCartItem) {
      addToCartGAE(oldCart, [addedCartItem]); // add new item to dataLayer
      //addToCartGAEAction(oldCart, [addedCartItem]);
    }
    // Trigger cart add message to update header cart count
    window.postMessage({ type: 'cart:add' }, window.location.origin)
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Error adding product(s) to cart`, err)
    throw err
  }
}*/

const { rr_warranties, rr_warranties_qa, rr_accessories } =
  RECOMMENDATIONS_PLACEMENT_IDS

  export const getAccessories = async (
  isLoggedIn,
  locale,
  sessionId,
  materialId,
  cartItems
) => {
  const cartItem = cartItems?.find(
    (cartItem) => cartItem?.materialInfo?.materialId === materialId
  )

  const request = {
    placementIds: rr_accessories,
    productId: materialId,
    locale,
    sessionId,
    salesOrg : await getSalesOrg(),
  }
  const placements = await getRecommendationsData(request)

  const webProduct = {
    image: cartItem?.materialInfo?.imageUrl,
    description: cartItem?.materialInfo?.description,
    materialId: cartItem?.materialInfo?.materialId,
    manufacturerPartNumber: cartItem?.materialInfo?.manufacturerPartNumber,
  }

  return {
    accessories: placements[rr_accessories]?.prodList,
    webProduct,
  }
}

export const getRecommendationsData = async (request) => {
  const { data } = await axios({
    method: POST,
    url: '/gapi/product-management/getRecommendations',
    data: request,
  })

  if ((!data || !Array.isArray(data), !data.length)) {
    console.warn('Error(s) retreveing placements')
  }

  const placements = data.reduce(
    (obj, cur) => ({
      ...obj,
      [cur.placementId]: cur,
    }),
    {}
  )
  return placements
}

export const getManufacturerWarranties = async (
  materialId,
  isIntegration,
  isLoggedIn,
  sessionId,
  locale
) => {
  try {
    const placementIds = isIntegration ? rr_warranties_qa : rr_warranties
    const request = {
      productId: materialId,
      placementIds: placementIds,
      categoryId: '',
      contractId: null,
      loggedin: isLoggedIn,
      sessionId,
      locale,
      salesOrg : await getSalesOrg(),
    }
    const placements = await getRecommendationsData(request)
    return placements?.[placementIds]?.prodList
  } catch (err) {
    console.warn(`Failed to fetch Manufacturer warranties: `, err)
    return []
  }
}

export const getWarranties = async (params) => {
  try {
    const {
      cartItems,
      cartItemId,
      isIntegration,
      locale,
      isLoggedIn,
      sessionId,
    } = params

    const cartItemData = cartItems?.find(
      (cartItem) => cartItem?.id === cartItemId
    )
    const {
      id,
      materialInfo,
      materialInfo: { materialId },
    } = cartItemData

    let [manufacturerWarranties, thirdPartyWarranties] = await Promise.all([
      getManufacturerWarranties(
        materialId,
        isIntegration,
        isLoggedIn,
        sessionId,
        locale
      ),
      getThirdPartyWarranties(materialId),
    ])

    if (
      thirdPartyWarranties?.length > 0 &&
      Array.isArray(thirdPartyWarranties)
    ) {
      thirdPartyWarranties = thirdPartyWarranties?.map(convertToProductWarranty)
    }

    return {
      warrantiesData: manufacturerWarranties,
      thirdPartywarrantiesData: thirdPartyWarranties,
      parentData: {
        parentCartItemId: id,
        parentMaterialData: materialInfo,
      },
    }
  } catch (err) {
    console.warn(`Failed to fetch Warranties: `, err)
  }
}

export const getRecommendationsByItems = async ({
  materialIds = [],
  isIntegration = false,
  locale,
  sessionId,
}) => {
  const encodedCartItemsString = materialIds.map((item) =>
    encodeURIComponent(item)
  )
  const placementIds = isIntegration ? 'cart_page.rr1_qa': 'cart_page.rr1';
  const { data } = await axios({
    method: POST,
    url: '/gapi/product-management/getRecommendations',
    data: {
      placementIds,
      locale,
      sessionId,
      productId: encodedCartItemsString.join('|'),
      salesOrg : await getSalesOrg(),
    },
  })

  if ((!data || !Array.isArray(data), !data.length)) {
    console.warn('Error(s) retrieving placements')
  }
  const placements = data.reduce(
    (obj, cur) => ({
      ...obj,
      [cur.placementId]: cur,
    }),
    {}
  )
  return placements[placementIds]
}
