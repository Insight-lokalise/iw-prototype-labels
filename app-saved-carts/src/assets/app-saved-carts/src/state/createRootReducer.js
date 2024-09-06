import { combineReducers } from 'redux'

import { carts, list, permissions } from '../duck'

export default function createRootReducer() {
  return combineReducers({
    carts,
    list,
    permissions,
  })
}
