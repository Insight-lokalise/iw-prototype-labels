import {
  DELETE_CART,
  FAIL_CART,
  FAIL_LIST,
  GET_CART,
  GET_LIST,
  SAVE_CART,
  SAVE_LIST,
  SAVE_PERMISSIONS,
} from './types'

const initialState = {
  data: {
    carts: [],
    orders: [],
  },
  isLoading: true,
  hasFailed: false
}

export function list(state = initialState, { type, payload }) {
  switch (type) {
    case GET_LIST: {
      return { hasFailed: false, isLoading: true }
    }
    case SAVE_LIST: {
      return { hasFailed: false, isLoading: false, data: payload.data }
    }
    case FAIL_LIST: {
      return { hasFailed: true, isLoading: false }
    }
    case DELETE_CART: {
      const newList = state.data[payload.type].filter(cart => cart.id !== payload.id)
      return { ...state, data: { ...state.data, [payload.type]: newList } }
    }
    default: return state
  }
}

export function carts(state = {}, { type, payload }) {
  const newState = { ...state }
  switch (type) {
    case GET_CART: {
      newState[payload.id] = { hasFailed: false, isLoading: true }
      return newState
    }
    case SAVE_CART: {
      newState[payload.id] = { hasFailed: false, isLoading: false, data: payload.data }
      return newState
    }
    case FAIL_CART: {
      newState[payload.id] = { hasFailed: true, isLoading: false }
      return newState
    }
    case DELETE_CART: {
      newState[payload.id] = undefined
      return newState
    }
    default: return state
  }
}

export function permissions(state = {}, { type, payload }) {
  switch(type) {
    case SAVE_PERMISSIONS: {
      return payload
    }
    default: return state
  }
}
