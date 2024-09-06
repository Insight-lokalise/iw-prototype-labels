import { getInObject } from '@insight/toolkit-utils'

export function selector_list(state) {
  return getInObject(state, 'list', {})
}

export function selector_cart(state, idNumber) {
  const id = typeof idNumber === 'number' ? idNumber.toString() : idNumber
  return getInObject(state, ['carts', id], {})
}

export function selector_cartListIndex(state, id, type) {
  const cartList = getInObject(selector_list(state), [ 'data', type ], [])
  const idList = cartList.map(entry => entry.id)
  return idList.indexOf(id)
}

export function selector_permissions(state) {
  return getInObject(state, 'permissions', {})
}
