import { combineReducers } from 'redux'

import { personalProductReducer, userData } from '../duck'

export default function createRootReducer() {
  return combineReducers({
    productList: personalProductReducer,
    user: userData,
  })
}
