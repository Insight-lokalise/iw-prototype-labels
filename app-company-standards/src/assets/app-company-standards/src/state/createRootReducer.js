import { combineReducers } from 'redux'

import {
  cache,
  differentWebgroupCategories,
  categories,
  categoryOrder,
  initialLoading,
  ipsContracts,
  isManagerView,
  labFees,
  productGroups,
  productSetItems,
  productSets,
  settings,
  tags,
  wId,
} from '../duck'

export default function createRootReducer() {
  return combineReducers({
    cache,
    differentWebgroupCategories,
    categories,
    categoryOrder,
    initialLoading,
    ipsContracts,
    isManagerView,
    labFees,
    productGroups,
    productSetItems,
    productSets,
    settings,
    tags,
    wId,
  })
}
