/* eslint camelcase: 0 */
import { getInObject, sortBy } from '@insight/toolkit-utils'

const YOURPRICELABEL = 'YOURPRICELABEL'

export function selector_productList(state) {
  return getInObject(state, 'productList', {})
}

export function selector_userData(state) {
  return getInObject(state, 'user', {})
}

export const selector_products = state => selector_productList(state).products || {}
export const selector_sequenceList = state => selector_productList(state).productSequence || []
export const selector_contractList = state => selector_productList(state).contracts || []
export const selector_licenses = state => selector_productList(state).licenses || []
export const selector_user = state => selector_productList(state).user || {}

export function selector_personalProductList(state) {
  const products = selector_products(state)
  const productSequences = selector_sequenceList(state)
  const personalProductList = productSequences.map(({ id, materialId, sequence }) => {
    const contractID = products[id] && products[id].price ? products[id].price.source : ''
    const contract = getContract(state, contractID)
    const programID = getProgramID(state, contractID)
    const mappedProducts = {
      contract,
      id,
      isValid: products[id] && products[id].valid,
      materialId,
      programID: programID && programID.programId,
      ...products[id],
      sequence,
      hasBestPrice: products[id] && products[id].price && products[id].price.yourBestPrice > 0,
      hasCOI: products[id] && products[id].availability && products[id].availability.coi > 0,
      hasCSI: products[id] && products[id].availability && products[id].availability.csi > 0,
      hasReserved: products[id] && products[id].availability && products[id].availability.cai > 0,
    }
    return mappedProducts
  })
  return personalProductList
}

export function selector_hasBestPrice(state){
  const bestPrice = selector_personalProductList(state)
  return bestPrice.find(item => item.price && item.price.yourBestPrice > 0 ) !== undefined
}

export function selector_hasCOI(state){
  const coiItems = selector_personalProductList(state)
  return coiItems.find(item => item.availability && item.availability.coi > 0 ) !== undefined
}

export function selector_hasCSI(state){
  const csiItems = selector_personalProductList(state)
  return csiItems.find(item => item.availability && item.availability.csi > 0 ) !== undefined
}

export function selector_hasReserved(state){
  const caiItems = selector_personalProductList(state)
  return caiItems.find(item => item.availability && item.availability.cai > 0 ) !== undefined
}

export function selector_isAllValid(state){
  const validItems = selector_personalProductList(state)
  return validItems.find(item => item.valid ) !== undefined
}

export function getContract(state, contractID){
  const contracts = selector_contractList(state)
  return contracts.find(contract => contract.number === contractID )
}

export function getProgramID(state, contractID){
  const licenses = selector_licenses(state)
  return licenses.find(license => license.number === contractID )
}

export function selector_userPermissions(state) {
  return getInObject(state, ['user', 'userPermissions'], {})
}

export function selector_isInventorySearchEnabled(state) {
  return selector_userPermissions(state).indexOf('view_plant_stocks') !== -1
}

export const selector_materialList = state => selector_sequenceList(state).map(i => i.materialId)

export function selector_isPurchasingPopUpEnabled(state){
  return selector_userPermissions(state).indexOf('enable_purchase_popup') !== -1
}
// handle null error for sortBy
export const selector_productsInSequence = products => (products) ? sortBy(({ sequence }) => sequence)(products) : null

export const Selector_isYourPriceLabel = state => {
  const {ips, priceSourceVerbiage}  = selector_user(state)
  return ips && priceSourceVerbiage === YOURPRICELABEL
}

export function selector_isEMEA(state){  
  return getInObject(state, ['user', 'isEMEA'], {})|| false
}


