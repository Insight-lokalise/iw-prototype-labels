import { getInObject, getRegion } from '@insight/toolkit-utils'
import {
  fetchCartTemplate,
  fetchAllCartTemplates,
  delCartTemplate,
  addToCart,
  getTranslations,
} from 'api'

import {
  existsCart,
  cartFails,
  listFails,
  getCart,
  getList,
  removeCart,
  saveCart,
  saveList,
  savePermissions,
} from './actions'
import { orderFormatting, INSIGHT_LOCALE_COOKIE_NAME } from '../lib'

export function setupStore() {
  return (dispatch) => {
    dispatch(getList())
    Promise.all([
      fetchAllCartTemplates(),
      getTranslations()
    ]).then(response => {
      const { data } = response[0]
      const list = {
        carts: data.filter(entry => entry.type === 'Cart'),
        orders: data.filter(entry => entry.type === 'Template'),
      }
      dispatch(saveList(list))
      dispatch(savePermissions(getInObject(window, [ 'Insight', 'userPermissions' ], {}), getRegion(INSIGHT_LOCALE_COOKIE_NAME) == "EMEA"))
    }).catch(() => {
      dispatch(listFails())
    })
  }
}

export function retrieveCart(id) {
  return (dispatch, getState) => {
    if (getState().carts[id]) {
      dispatch(existsCart())
      return Promise.resolve()
    }
    dispatch(getCart(id))
    return fetchCartTemplate(id).then(response => {
      const list = orderFormatting(response.data)
      dispatch(saveCart(list, id))
    }).catch(() => {
      dispatch(cartFails(id))
    })
  }
}

export function deleteCart(id, type) {
  return dispatch =>
    delCartTemplate(id).then(() => {
      dispatch(removeCart(id, type))
    })
}

export function addCart(id) {
  addToCart(id).then(() => true)
}
