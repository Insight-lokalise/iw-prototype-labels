export { catalog } from './mockData'
import {
  catalog,
  productSets,
  cartResponse,
  enhancedLineItem,
} from './mockData'

export function fetchInitialData() {
  return Promise.resolve(catalog)
}

export function putPin(id) {
  return Promise.resolve(true)
}

export function deletePin(id) {
  return Promise.resolve(true)
}

export function editUserSettings(settings) {
  return Promise.resolve()
}

export function fetchProductSets(id) {
  console.log(`Getting sets associated with group ${id}`)
  return Promise.resolve({ data: productSets })
}

export function fetchPDP(id) {
  console.log(`Getting PDP for ${id}`)
  return Promise.resolve({})
}

export function addGroupToCart(productGroupId) {
  console.log('Adding preselected group to cart', productGroupId)
  return Promise.resolve({ data: cartResponse })
}

// Structure for list should be as follows:
//  {
//    productGroupId: String,
//    productSets: {
//      productSetId1: { itemId1: Number, itemId2: Number },
//      productSetId2: { itemId5: Number },
//    }
//  }
export function addSetsToCart(list) {
  console.log('Adding customized group to cart', list)
  return Promise.resolve({ data: cartResponse })
}

export function getPDP({ contractId, locale, materialId }) {
  console.log('Getting product details', { contractId, locale, materialId })
  return Promise.resolve({ data: enhancedLineItem })
}