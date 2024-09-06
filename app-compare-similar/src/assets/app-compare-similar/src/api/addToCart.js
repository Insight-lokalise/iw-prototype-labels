import axios, { GET, POST } from './axios'
import { getUTCTimeStamp } from '@insight/toolkit-utils'
import { addToCartGAE } from '@insight/toolkit-utils/lib/analytics'

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

const generateData = (item) => {
  const { contractID, contractType } = item[0] ?? item
  const clientBrowserDate = getUTCTimeStamp()
  // Check if item contains an array of products.
  if (Array.isArray(item)) {
    return item.map((currentItem) => ({
      clientBrowserDate,
      hasAccessories: currentItem.hasAccessories,
      materialID: currentItem.materialId,
      quantity: currentItem.quantity,
      warrantyMaterialIds: currentItem.warrantyMaterialIds,
      warrantyDetail: currentItem.warrantyDetail,
      ...(!!(contractID || contractType) && { contractID }),
      ...(!!contractType && { contractType }),
    }))
  }
  return [
    {
      clientBrowserDate,
      hasAccessories: item.hasAccessories,
      materialID: item.materialId,
      quantity: item.quantity,
      warrantyMaterialIds: item.warrantyMaterialIds,
      warrantyDetail: item.warrantyDetail,
      ...(!!(contractID || contractType) && { contractID }),
      ...(!!contractType && { contractType }),
      locale: item.locale
    },
  ]
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
export const addToCart = async (item, categoryType) => {
  const signalMetaData = window.sessionStorage.getItem('signalMetaData')
  try {
    // get current cart before adding item, needed for tracking / analytics purpose
    const { data: oldCart } = await getCart()
    const payload = generateData(item)
    payload[0].signalMetaData = signalMetaData

    const { data } = await axios({
      method: POST,
      url: `/insightweb/transaction/addtocart`,
      data: payload,
    })
    if (!data) throw new Error('Error adding product(s) to cart')
    // successfully added item // report to datalayer
    const {
      cart: { cartItemsForEmail },
    } = data
    const cartItem = cartItemsForEmail.find(
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
      }
      if (categoryType) {
        addedCartItem.categoryType = categoryType
      }
      addToCartGAE(oldCart, [addedCartItem]); // add new item to dataLayer
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

export default {
  addToCart,
}
