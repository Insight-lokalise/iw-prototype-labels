import groupBy from 'lodash/groupBy'

import { isBundlePart } from './cartItem'

/**
 * Gives structure to items.
 * @param { String } type
 * @param { Array | Object } data.
 * @returns { Object }
 */
export function createStructure(type) {
  return (data, name = '') => ({ type, name, data })
}

/**
 * Boolean check for bundles.
 * @param { Array of Objects | Array of Arrays } items
 * @returns { Boolean }
 */
export function containsBundles(items) {
  return items.some(item => {
    if (Array.isArray(item)) {
      return item.some(item => item.bundle)
    }
    return item.bundle
  })
}

/**
 * Boolean check for contracts.
 * @param { Array of Objects | Array of Arrays } items
 * @returns { Boolean }
 */
export function containsContracts(items) {
  return items.some(item => {
    if (Array.isArray(item)) {
      return item.some(item => item.contractId)
    }
    return item.contractId
  })
}

/**
 * Traverses the array of objects looking for bundle items.
 * Groups the bundle items with same id into separate arrays.
 * Returns an array of arrays containing grouped bundles.
 * @param { Array of Objects } items
 * @returns { Array of Arrays }
 */
export function filterAndGroupByBundleId(parts) {
  const groupedBundleParts = groupBy(parts.filter(isBundlePart), item => item.bundle.sapLineItemNumber)
  return Object.values(groupedBundleParts)
}
