import { get, post } from '../fetch'

/**
 * Gets the User's Cart from the server session
 * @return {Object} cart object
 */
export function getCart() {
  const timestamp = new Date().getTime()
  return get(`transaction/getcart?_=${timestamp}`).catch((error) => {
    console.warn('Failed to fetch cart', error)
    throw error // re-throw error for initial testing of functionality
  })
}

/**
 * Submits a sequence of items to be added to the session's cart.
 * @param {Object} item [{
          clientBrowserDate: moment().format("M/D/YYYY"),
          selectedSoftwareContractId: "",
          programId: "",
          previousSearchURL: "",
          materialID: materialId,
          quantity: quantity
      },
      ...
  ];
 */
export function addToCart(item) {
  const timestamp = new Date().getTime()
  return post(`/insightweb/transaction/addtocart?_=${timestamp}`, item).catch(
    (error) => {
      console.warn(`Failed to add item ${JSON.stringify(item)} to cart`)
      throw error // re-throw error for initial testing of functionality
    }
  )
}

/**
 *  Update the quantity of an item or items.
 *  (NOTE may not only be quantity - check before implementing another function)
 *
 *  @param updates - updates.materialId is actually the materialIDKey, or the items
 *  placement in the cart response rather than the item-to-update's actual materialId.
 *
 *  NOTE tranShoppingCart.js:1969, (definition of update()) describes an issue
 *  where a shipTo is required in some cases. However, that is based off a 2013
 *  CR where a deprecated stored db procedure was being used. We need to check if
 *  that proc has been updated.
 *
 * @param {Object || Array<Object>}     [{ contractID, materialID, quantity }, ..]
 * @return {[type]} [description]
 */
export function updateCart(updates) {
  const timestamp = new Date().getTime()
  if (!Array.isArray(updates)) updates = [updates]
  return post(`transaction/updatecart?_=${timestamp}`, updates).catch(
    (error) => {
      console.warn(`Failed to update cart with ${JSON.stringify(updates)}`)
      throw error
    }
  )
}

/**
 * Deletes a selected item from the cart
 * @param  {object} itemObject {materialID: materialIDKey, contractID: contractID}
 *                              Note -- the cartItem object does have a materialID property,
 *                               but you actually want to send the materialIDKey
 * @return {object}            server response will be the cart object
 */
export function deleteFromCart(itemObject) {
  const timestamp = new Date().getTime()
  return post(`transaction/deletefromcart?_=${timestamp}`, itemObject).catch(
    (error) => {
      console.warn(
        `Failed to delete item: ${JSON.stringify(itemObject)} from cart`
      )
      throw error
    }
  )
}

/**
 * Deletes all items in the cart
 *
 * @return {Promise<Object>} cart   A standard cart-shaped Object.
 */
export function emptyCart() {
  const timestamp = new Date().getTime()
  return get(`transaction/clearcart?_=${timestamp}`).catch((error) => {
    throw error // re-throw error for initial testing of functionality
  })
}

export function toggleProductImage(bool) {
  return get(`account/update/productImage/${bool}`).catch((error) => {
    console.warn(`Failed to ${bool? 'show': 'hidde'} prouduct image`)
    throw error
  })
}

export function getUserInformation() {
  return get(`getUserInformation`).catch((error) => {
    throw error
  })
}

/**
 * [makeUniqueCartItemId description]
 * When normalizing the cart we needed a unique identifer for cart items, so materialIDKey
 * combined with contractId seemed like a good fit, this function reduces extra work
 * in reducers
 * @param  {String} [contractID=''] [description]
 * @param  {String} materialIDKey   [description]
 * @return {String}                 [contractId__materialIDKey]
 */
export function makeUniqueCartItemId({ contractID = '', materialIDKey }) {
  return `${contractID}__${materialIDKey}`
}

/**
 * adds line level fields from form to legacy cart
 * @param {array} lineLevelInfo array of all of the form data
 */
export function addToCartLineLevelReportingFields(lineLevelInfo) {
  return post(
    '/insightweb/transaction/addtocartlinelevelreportingfields',
    lineLevelInfo
  ).catch((error) => {
    console.warn(
      `Failed to add lineLevelInfo ${JSON.stringify(lineLevelInfo)} to cart`
    )
    throw error // re-throw error for initial testing of functionality
  })
}

/**
 * Get mini PDP information
 * @param locale & materialID
 */
export function fetchProductInformation({ locale, materialId }) {
  return get(
    `cs/endUser/productInformation?locale=${locale}&matId=${encodeURIComponent(
      materialId
    )}`
  ).catch((error) => {
    console.warn(`Failed to fetch PDP information`, error)
    throw error
  })
}

/**
 * Transform the User's session cart to the shopping request
 * @return {Object} cart object
 */
export const transformCart = async () => {
  try {
    const res = await get(`/insightweb/transformCartToShoppingRequest`)
    return res.shoppingRequest
  } catch (err) {
    console.warn('Failed to transform cart', error)
    throw error
  }
}
