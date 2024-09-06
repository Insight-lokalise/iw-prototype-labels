import axios, { POST } from './axiosConfig'
import { getCart } from './getData'
import { getSessionUser } from '../api'
import { addToCartGAE } from '@insight/toolkit-utils/lib/analytics'
import { l, getWebPrice } from '@insight/toolkit-utils'
import { addFieldsForHybridX } from 'app-api-user-service'
import { getRequestForRecommendationsApi } from './getPlacements'

export const addToCart = async (item, categoryType) => {
  // in search page add to cart method is only called with one item at a time, so moving analytics logic in here
  try {
    // get current cart before adding item, needed for tracking / analytics purpose
    const { data: oldCart } = await getCart()

    const { data } = await axios({
      method: POST,
      url: `/insightweb/transaction/addtocart`,
      data: item,
    })
    if (!data) throw new Error('Error adding product(s) to cart')
    // successfully added item // report to datalayer
    const {
      cart: { cartItemsForEmail },
    } = data
    const cartItem = cartItemsForEmail.find(
      (part) => part.materialID == item[0].materialID
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
        quantity: item[0].quantity || cartItem.quantity,
        currency: cartItem.currency,
      }
      if(categoryType){
        addedCartItem.categoryType = categoryType
      }
      addToCartGAE(oldCart, [addedCartItem]) // add new item to dataLayer
    }
    // Trigger cart add message to update header cart count
    window.postMessage({ type: 'cart:add' }, window.location.origin)
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Error adding product(s) to cart`, err)
    throw err
  }
}

export const getRecommendations = async (materialId) => {
  const placementIds = `add_to_cart_page.rr_accessories|add_to_cart_page.rr_warranties`;
  const url = '/gapi/product-management/getRecommendations';
  const body = await getRequestForRecommendationsApi(placementIds,materialId);
  const { data } = await axios({
   method: POST,
      url,
      data: body,
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

  return {
    accessories: placements['add_to_cart_page.rr_accessories'],
    protection: placements['add_to_cart_page.rr_warranties'],
  }
}

export const getProductDetails = async ({
  locale,
  materialId,
  salesOrg,
  includeSpecifications = false,
  includeVariants = false,
}) => {
  try {
    const params = {}
    const { userInformation, isLoggedIn } = await getSessionUser()

    const {
      currencyCode,
      webLoginProfileId: userId,
      webGroup: { webGroupId } = {},
      account: { soldToId: soldTo } = {},
      UserType: userType,
      isCES,
    } = userInformation || {}

    await addFieldsForHybridX({isLoggedIn, isCES}, params, { userType })

    const { data } = await axios({
      method: POST,
      url: '/gapi/product-management/product',
      data: {
        locale,
        materialId: decodeURIComponent(materialId),
        salesOrg,
        includeSpecifications,
        includeVariants,
        soldTo,
        currencyCode,
        webGroup: webGroupId,
        userId,
        ...params
      },
    })
    if (!data.product) throw new Error('Error finding product')
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch product details`, err)
    return {}
  }
}

export const getThirdPartyWarranties = async (materialId, salesOrg, contract) => {
  const {
    userInformation,
    isIpsLogo,
    isLoggedIn,
  } = await getSessionUser()
  try {
    const soldto = userInformation?.account?.soldToId
    const wg = userInformation?.webGroup?.webGroupId
    const isIPSUser = (isLoggedIn && userInformation.isIpsUser) || isIpsLogo
    const isIPSUserWithContract = isIPSUser && !!contract
    const contractId =  contract?.contractNumber || ""
    const locale = l()
    const { product } = await getProductDetails({
      materialId,
      locale,
      salesOrg,
    })
    
    const webPrice = product?.price?.webPrice
    const insightPrice = product?.price?.insightPrice
    const listPrice = product?.price?.listPrice
    const categoryCode = product?.category?.code
    const manufacturerRule = product?.manufacturer?.name
    const materialQualifier = product?.materialQualifier
    const productTypeRule = product?.productTypeRule

    const request = {
      //app-search includes E4, CES, including default logged-out users
      ces: true,
      contractId,
      categoryCode,
      materialQualifier,
      matId: materialId,
      manufacturerRule,
      productTypeRule,
      salesOrg,
      locale,
      ipsUser: isIPSUserWithContract,
      soldto,
      uid: userInformation?.webLoginProfileId,
      price: getWebPrice({ isLoggedIn, webPrice, insightPrice, listPrice }),
      wg,
      filterCallForPrice: false, // true will filter warranties with call for price
    }
    const { data } = await axios({
      method: POST,
      url: '/insightweb/getWarranty',
      data: request,
    })
    return data
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to fetch third party warranties`, err)
    return []
  }
}

export const prepareAddToCartData = async (
  materialId,
  locale,
  salesOrg,
  currency
) => {
  // Get placements from RR
  const placements = await getRecommendations(materialId)
  const isUSLocale =
    locale && locale.split('_')[1] === 'US' && currency === 'USD'
  //Get 3rd party warranties only for US for now
  const thirdPartyProtection = isUSLocale
    ? await getThirdPartyWarranties(materialId, salesOrg)
    : []
  const { accessories, protection } = placements
  const hasAccessories = accessories?.prodList?.length > 0
  const warrantyMaterialIds =
    protection?.prodList?.map((prod) => prod.materialId) || []
  const thirdPartyWarrantyIds =
    (thirdPartyProtection &&
      thirdPartyProtection?.map((warranty) => warranty.materialId)) ||
    []

  return {
    accessories,
    hasAccessories,
    protection,
    thirdPartyProtection,
    warrantyMaterialIds,
    thirdPartyWarrantyIds,
  }
}
