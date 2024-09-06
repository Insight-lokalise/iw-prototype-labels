import {
  CACHE,
  DELETE_TAG,
  FAIL_INITIALLOAD,
  GET_INITIALLOAD,
  REMOVE_CACHE,
  REORDER_PRODUCTGROUP,
  REORDER_PRODUCTSET,
  SAVE_DIFFERENT_WEBGROUP_CATEGORIES,
  SAVE_CATEGORIES,
  SAVE_CATEGORYORDER,
  SAVE_INITIALLOAD,
  SAVE_IPS_CONTRACTS,
  SAVE_LAB_FEES,
  SAVE_MANAGER_FLAG,
  SAVE_PRODUCT_SET_ITEMS,
  SAVE_PRODUCTGROUPS,
  SAVE_PRODUCTSETS,
  SAVE_SETTINGS,
  SAVE_TAGS,
  SAVE_WEBGROUPID,
  DELETE_PRODUCT_SET_ITEMS,
  PUBLISH_ALL_FLUSH,
} from './types'
import { defaultSettings } from './initialState'

// Marks which entities have already had their children cached.
export function cache(state = {}, { type, payload }) {
  switch (type) {
    case CACHE: {
      return { ...state, [payload]: true }
    }
    case REMOVE_CACHE: {
      return { ...state, [payload]: false }
    }
    case PUBLISH_ALL_FLUSH: {
      /**
       * Flush entire cache object since we are re-fetching 
       * all the categories again to sync up state with backend
       **/            
      return {}
    }
    default: {
      return state
    }
  }
}

// Saves different webgroup categories
export function differentWebgroupCategories(state = {}, { type, payload }) {
  switch (type) {
    case SAVE_DIFFERENT_WEBGROUP_CATEGORIES: {
      return { ...payload }
    }
    default: {
      return state
    }
  }
}

// Saves categories
export function categories(state = {}, { type, payload }) {
  switch (type) {
    case SAVE_CATEGORIES: {
      return { ...state, ...payload }
    }
    case REORDER_PRODUCTGROUP: {
      const {id, order} = payload
      const category = state[id]
      const nextCategory = {...category, order}
      return {...state, [id]:{...nextCategory}}
    }
    case DELETE_TAG: {
      const newState = { ...state }
      for (const id in state) {
        if(state[id].tags && state[id].tags.includes(payload)) {
          newState[id] = { ...state[id] }
          newState[id].tags = newState[id].tags.filter(tagId => tagId !== payload)
        }
      }
      return newState
    }
    default: {
      return state
    }
  }
}

// Saves category display order
export function categoryOrder(state = [], { type, payload }) {
  switch (type) {
    case SAVE_CATEGORYORDER: {
      return payload
    }
    default: {
      return state
    }
  }
}

// Handles status of initial data loading
export function initialLoading(state = { hasFailed: false, isLoading: true }, { type, payload }) {
  switch (type) {
    case GET_INITIALLOAD: {
      return { hasFailed: false, isLoading: true }
    }
    case SAVE_INITIALLOAD: {
      return { hasFailed: false, isLoading: false }
    }
    case FAIL_INITIALLOAD: {
      return { hasFailed: true, isLoading: false, error: payload }
    }
    default: {
      return state
    }
  }
}

// Saves ipsContracts
export function ipsContracts(state = [], { type, payload }) {
  switch (type) {
    case SAVE_IPS_CONTRACTS: {
      return payload
    }
    default: {
      return state
    }
  }
}

// Saves labFees
export function labFees(state = {}, { type, payload }) {
  switch (type) {
    case SAVE_LAB_FEES: {
      return { ...state, ...payload }
    }
    default: {
      return state
    }
  }
}

// Saves manager flag boolean
export function isManagerView(state = false, { type, payload }) {
  switch (type) {
    case SAVE_MANAGER_FLAG: {
      return payload
    }
    default: {
      return state
    }
  }
}

// Saves product groups
export function productGroups(state = {}, { type, payload }) {
  switch (type) {
    case SAVE_PRODUCTGROUPS: {
      return { ...state, ...payload }
    }
    case REORDER_PRODUCTSET: {
      const {id, order} = payload
      const productSet = state[id]
      const nextProductSet = {...productSet, order}
      return {...state, [id]:{...nextProductSet}}
    }
    case DELETE_TAG: {
      const newState = { ...state }
      for (const id in state) {
        if(state[id].tags && state[id].tags.includes(payload)) {
          newState[id] = { ...state[id] }
          newState[id].tags = newState[id].tags.filter(tagId => tagId !== payload)
        }
      }
      return newState
    }
    case PUBLISH_ALL_FLUSH: {
      /**
       * Flush cache entire productGroups object since we are re-fetching 
       * all the categories again to sync up state with backend
       **/            
      return {}
    }
    default: {
      return state
    }
  }
}

// Saves product sets
export function productSetItems(state = {}, { type, payload }) {
  switch (type) {
    case SAVE_PRODUCT_SET_ITEMS: {
      return { ...state, [payload.productSetId]: payload.productSetItems }
    }
    case DELETE_PRODUCT_SET_ITEMS: {
      const newState = payload.productSetIds.reduce((acc, curr) => {
        const { [curr]: throwaway, ...keptState } = acc
        return keptState
      }, { ...state })
      return newState
    }
    default: {
      return state
    }
  }
}

// Saves product sets
export function productSets(state = {}, { type, payload }) {
  switch (type) {
    case SAVE_PRODUCTSETS: {
      return { ...state, ...payload }
    }
    case SAVE_PRODUCT_SET_ITEMS: {
      const { productSetId, productSetItems } = payload
      const newState = { ...state }
      newState[productSetId] = { ...newState[productSetId], items: productSetItems }
      return newState
    }
    case PUBLISH_ALL_FLUSH: {
      /**
       * Flush cache entire productSets object since we are re-fetching 
       * all the categories again to sync up state with backend
       **/            
      return {}
    }
    default: {
      return state
    }
  }
}

// Save settings
export function settings(state = defaultSettings, { type, payload }) {
  switch (type) {
    case SAVE_SETTINGS: {
      return payload
    }
    default: {
      return state
    }
  }
}

// Saves tags
export function tags(state = {}, { type, payload }) {
  switch (type) {
    case SAVE_TAGS: {
      return { ...state, ...payload }
    }
    case DELETE_TAG: {
      const { [payload]: deletedTag, ...newState } = state
      return newState
    }
    default: {
      return state
    }
  }
}

// Saves wId
export function wId(state = null, { type, payload }) {
  switch (type) {
    case SAVE_WEBGROUPID: {
      return payload
    }
    default: {
      return state
    }
  }
}
