import axios, { GET, POST } from './axios';
import { getCurrentLocale, getUTCTimeStamp } from '@insight/toolkit-utils';
import {
  addToCartGAE,
  addToShoppingCartGAE,
} from '@insight/toolkit-utils/lib/analytics';
import addToCartRequest from '@insight/toolkit-utils/lib/helpers/addToCartRequest';
import { addToShoppingRequest } from 'app-api-user-service';
import { getShoppingRequestEnabledFlag } from "@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag";
import { getWarrantyMaterialIds } from '../lib/warranties';
import { getSessionUser } from "./getSessionUser";
import { getNonIpsRecommendations } from './getNonIpsRecommendations';

const generateData = async (item, locale, isShoppingCartEnabled, salesOrg) => {
  if (!item) return
  const clientBrowserDate = getUTCTimeStamp()
  // Generate the payload for a meterial using the placements API response
  const generatePayload = async (data) => {
    if (!data) return
    try {
      // Get placement data for the selected material
      const { accessories, protection, thirdPartyProtection } = await getNonIpsRecommendations(data.materialId, true, salesOrg) || {}
      // Check if the material has accessories
      const hasAccessories = accessories?.prodList?.length ? true : false
      // Get the list of protection plan ids
      const warrantyMaterialIds = getWarrantyMaterialIds(protection, thirdPartyProtection);
      if (isShoppingCartEnabled) {
        // Return payload for the current material
        return {
          hasAccessories,
          locale,
          materialID: data.materialId,
          quantity: data.quantity,
          warrantyMaterialIds,
        }
      } else {
        const contractID = item?.contractID
        const contractName = item?.contractName
        // Return payload for the current material
        return {
          materialID: data.materialId,
          quantity: data.quantity,
          warrantyDetail: data.warrantyDetail,
          clientBrowserDate,
          hasAccessories,
          warrantyMaterialIds,
          ...(contractID && { contractID }),
          ...(contractName && { contractName })
        }
      }
    } catch (err) {
      throw err
    }
  }
  // Check if item contains an array of products.
  if (Array.isArray(item)) {
    // Map products and get payload for each material
    return await Promise.all(item.map(generatePayload))
  }
  // Check if warranty materials and hasAccessories is present in the item

  // Adding the assortmentId and Software / Hardware Contract Id's
  const extraRequestPayload = {}
  const hasContractID = item.hasOwnProperty('contractID')
  if (item?.softwareContractId && item?.softwareContractId !== "") {
    extraRequestPayload['assortmentId'] = item?.assortmentId;
    extraRequestPayload['selectedSoftwareContractID'] = item?.softwareContractId;
  } else if (!hasContractID){
    // addToCart function sometimes are case sensitive
    // making sure all contractID passed in payload will be as contractID
    extraRequestPayload['contractID'] = item?.ipsContractId || item?.contractId;
  }
  extraRequestPayload['programId'] = item?.programId;

  if (
    item.warrantyMaterialIds !== undefined &&
    item.hasAccessories !== undefined
  ) {
    return [
      {
        clientBrowserDate,
        materialID: item.materialId,
        quantity: item.quantity,
        warrantyDetail: item.warrantyDetail,
        hasAccessories: item.hasAccessories,
        warrantyMaterialIds: item.warrantyMaterialIds,
        contractID: item.contractID,
        ...extraRequestPayload
      },
    ]
  }
  const payload = await generatePayload(item)
  return [{ ...payload, ...extraRequestPayload }]
}

/** Add To Cart API
 *
 * Add the product(s) to cart using the materialId and quantity
 * @param {array<object>} items
 *    @param {string} clientBrowserDate - 
 *    @param {string} materialId - Unique product id
 *    @param {number} quantity - Amount of product to add to cart
 *    @param {number} warrantyMaterialIds - List of all available warranties
 *    @param {number} warrantyDetail - Details of the selected warranty
 [
    {
      clientBrowserDate: '2022-03-16 11:26:48 -05:00',
      materialID: 'W1A53A#BGJ',
      quantity: 1,
      warrantyMaterialIds: ['UB9U1E'],
      warrantyDetail: {
        parentMaterialId: 'W1A53A#BGJ',
        quantity: 1,
        warrMaterialId: 'UB9U1E',
      },
    }
  ]
 */
export const addToCart = async (item, isLoggedIn, noWarrantyCheck, categoryType, isIPSUserWithContract) => {
  const locale = getCurrentLocale('insight_locale')
  const { userInformation } = await getSessionUser()
  const webGroupId = userInformation?.webGroup?.webGroupId
  const salesOrg = userInformation?.salesOrg
  const isShoppingReqWGEnabled = window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
  const isLoggedOutDefault = window?.flags['GNA-10394-SHOPPING-CART'] && !isLoggedIn && locale.split("_")[1] === 'US'
  const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, isLoggedOutDefault, isShoppingReqWGEnabled)
  const signalMetaData = window.sessionStorage.getItem('signalMetaData')
  const payload = await generateData(item, locale, isShoppingCartEnabled && !isIPSUserWithContract, salesOrg)
  const isLogoutIPS = window?.flags && window?.flags["GNA-12345-LOGGEDOUT-E4-IPS"]
  if (noWarrantyCheck && payload?.length) payload[0].warrantyMaterialIds = [] // allow warranty to be added without parent/main item
  try {
    if (isShoppingCartEnabled && !isLogoutIPS) {
      // get current cart before adding item, needed for tracking / analytics purpose
      const itemsToQuantity = itemsToAddQuantityMap(payload)
      const cart = await addToCartRequest(payload, addToShoppingRequest)
      updateCartToGAE(cart, itemsToQuantity, categoryType)
      return cart
    } else {
      payload[0].signalMetaData = signalMetaData
      // get current cart before adding item, needed for tracking / analytics purpose
      const itemsToQuantity = itemsToAddQuantityMap(payload)
      const { data: oldCart } = await getCart()
      const { data } = await axios({
        method: POST,
        url: `/insightweb/transaction/addtocart`,
        data: payload,
      })
      if (!data) throw new Error('Error adding product(s) to cart')
      // Trigger cart add message to update header cart count
      // successfully added item // report to datalayer
      const {
        cart: { cartItemsForEmail },
        materialIdKeyList,
      } = data

      // retrieve items newly added by using materialIdKeyList
      const newlyAddedItems = cartItemsForEmail.filter((part) => {
        const { selectedProductWarranty, materialIDKey } = part
        const parentMaterialIDKey = selectedProductWarranty?.parentMaterialIDKey
        return (
          materialIdKeyList.includes(materialIDKey) ||
          materialIdKeyList.includes(parentMaterialIDKey)
        )
      })

      const itemsAddedToCart = newlyAddedItems?.reduce((acc, part) => {
        const ItemToAdd = {
          name: part.description,
          id: part.materialID,
          productSku: part.mfrPartNumber,
          insightPartId: part.materialID,
          price: part.price,
          brand: part.manufacturerName,
          category: part.categoryId,
          quantity: itemsToQuantity?.[part.materialID] || part.quantity,
          currency: part.currency,
        }
        if (categoryType) {
          ItemToAdd.categoryType = categoryType
        }
        const addedCartItem = [ItemToAdd]
        return acc.concat(addedCartItem)
      }, [])

      if (itemsAddedToCart.length) {
        addToCartGAE(oldCart, [...itemsAddedToCart]) // add new item to dataLayer
      }
      window.postMessage({ type: 'cart:add' }, window.location.origin)
      return data
    }
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Error adding product(s) to cart`, err)
    throw err
  }
}

function itemsToAddQuantityMap(payload) {
  return payload.reduce((acc, part) => {
    const { materialID, warrantyDetail, quantity } = part
    const warrantyMaterialID = warrantyDetail?.warrMaterialId
    let partsToAdd = { [materialID]: quantity }
    if (warrantyMaterialID) {
      partsToAdd = { [materialID]: quantity, [warrantyMaterialID]: quantity }
    }
    return { ...acc, ...partsToAdd }
  }, {})
}

function updateCartToGAE(cart, itemsToQuantity, categoryType) {
  // successfully added item // report to datalayer
  const { shoppingRequest } = cart
  const {
    cart: { cartItems }
  } = shoppingRequest
  const itemsAddedKeys = Object.keys(itemsToQuantity)
  let newlyAddedItemsData = [];
  // retrieve items newly added by using materialId of the selected item and comparing it with itemstoquantity
  itemsAddedKeys.forEach(id => {
    cartItems.forEach(item => {
      if (id === item.materialInfo.materialId) {
        newlyAddedItemsData.push(item);
      }
    });
  });

  const itemsAddedToCart = newlyAddedItemsData?.reduce((acc, part) => {
    const ItemToAdd = {
      name: part.materialInfo.description,
      id: part.materialInfo.materialId,
      productSku: part.materialInfo.manufacturerPartNumber,
      insightPartId: part.materialInfo.materialId,
      price: part.materialInfo.unitPrice,
      brand: part.materialInfo.manufacturerName,
      category: part.materialInfo.categoryId,
      quantity: itemsToQuantity?.[part.materialInfo.materialId] || part.quantity,
      currency: shoppingRequest.soldTo.currency
    }
    if (categoryType) {
      ItemToAdd.categoryType = categoryType
    }
    const addedCartItem = [ItemToAdd]
    return acc.concat(addedCartItem)
  }, [])

  addToShoppingCartGAE(
    shoppingRequest.cart,
    [...itemsAddedToCart]
  ) // add new item to dataLayer
}

function getCart() {
  const timestamp = new Date().getTime()
  return axios({
    method: GET,
    url: `insightweb/transaction/getcart?_=${timestamp}`,
  }).catch((error) => {
    console.warn('Error getting cart: ' + error)
    throw error
  })
}

export default {
  addToCart,
}
