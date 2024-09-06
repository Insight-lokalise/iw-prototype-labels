import {
  DELETE_CART,
  EXISTS_CART,
  FAIL_CART,
  FAIL_LIST,
  GET_CART,
  GET_LIST,
  SAVE_CART,
  SAVE_LIST,
  SAVE_PERMISSIONS,
} from './types'

export function existsCart() {
  return { type: EXISTS_CART }
}

export function cartFails(id) {
  return { type: FAIL_CART, payload: { id } }
}

export function listFails() {
  return { type: FAIL_LIST }
}

export function getCart(id) {
  return { type: GET_CART, payload: { id } }
}

export function getList() {
  return { type: GET_LIST }
}

export function removeCart(id, type) {
  return { type: DELETE_CART, payload: { id, type } }
}

export function saveCart(data, id) {
  return { type: SAVE_CART, payload: { data, id } }
}

export function saveList(data) {
  return { type: SAVE_LIST, payload: { data } }
}

export function savePermissions(userPermissions, isEMEA) {
  const enablePurchasePopup = userPermissions.includes('enable_purchase_popup')
  return { type: SAVE_PERMISSIONS, payload: {
    enablePurchasePopup,
    isEMEA,
  }}
}
