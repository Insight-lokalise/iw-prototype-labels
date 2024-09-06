import { combineReducers } from 'redux'

import {
  categories,
  locale,
  pins,
  productGroups,
  productSets,
  tags,
  userData,
  userSettings,
  webGroupSettings,
} from '../duck'

export default function createRootReducer() {
  return combineReducers({
    categories,
    locale,
    pins,
    productGroups,
    productSets,
    tags,
    userData,
    userSettings,
    webGroupSettings,
  })
}
