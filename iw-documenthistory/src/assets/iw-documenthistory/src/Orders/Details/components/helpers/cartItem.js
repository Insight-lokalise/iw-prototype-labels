/**
 * Ment to identify standalone items. That means
 * that the boolean returned will be true if the object passed
 * is not part of a bundle nor a contract.
 * @param { Object } obj
 * @returns Boolean
 */
export function isStandaloneItem(obj) {
  return isObject(obj) && !obj.bundle && !isContract(obj)
}

/**
 * Ment to identify standalone bundles. That means that the bundle
 * does not belong to a contract.
 * @param { Array } arr
 *
 */
export function isStandaloneBundle(arr) {
  return Array.isArray(arr) && arr.some(item => item.bundle && !isContract(item))
}

/**
 * Ment to identify line items that belong to a contract
 * but are not part of a bundle.
 * @param { Object } obj
 * @returns Boolean
 */
export function isContractItem(obj) {
  return isObject(obj) && !obj.bundle && isContract(obj)
}

/**
 * Ment to identify any type of bundle; Whether thay are standalone
 * or contract. Items should already been parsed into bundle arrays.
 * @param { Array } arr
 * @returns Boolean
 */
export function isBundle(arr) {
  return Array.isArray(arr) && arr.some(item => item.bundle)
}

/**
 * Ment to identify items that belong to a bundle but are not part of a contract.
 * @param { Object } obj
 */
export function isStandaloneBundlePart(obj) {
  return isBundlePart(obj) && !isContract(obj)
}

/**
 * Ment to identify any type of bundle parts. They can either belong to
 * a contract or not.
 * @param { Object } obj
 */
export function isBundlePart(obj) {
  return isObject(obj) && !!obj.bundle
}

/**
 * Ment to identify any item that belongs to a contract. That includes
 * items that also belong to bundles.
 * @param { Object } obj
 */
export function isContractPart(obj) {
  return isObject(obj) && isContract(obj)
}

function isObject(obj) {
  return typeof obj === 'object' && !Array.isArray(obj)
}

function isContract(obj) {
  return !!obj.contractId || !!obj.contractName
}
