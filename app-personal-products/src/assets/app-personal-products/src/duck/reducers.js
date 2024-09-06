import { getInObject } from '@insight/toolkit-utils'
import {
  ADD_TO_PERSONAL_PRODUCTS_SUCCESS,
  ADD_TO_PERSONAL_PRODUCTS_FAILED,
  GET_PERSONAL_PRODUCTS_SUCCESS,
  GET_USERDATA,
  SAVE_USERDATA,
  DELETE_FROM_PERSONAL_PRODUCTS_SUCCESS,
  UPDATE_PERSONAL_PRODUCTS_SEQUENCE_SUCCESS,
} from './types'
import {selector_productsInSequence} from './index'

/* eslint-disable import/prefer-default-export */

const initialState = {
  products: {},
  productSequence: [],
  contracts: [],
  licenses: [],
  invalidProducts: [],
  hasDEP: false,
}

export function personalProductReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ADD_TO_PERSONAL_PRODUCTS_SUCCESS:      
      return {
        ...state,
        products: {...getInObject(payload, 'products', {}), ...getInObject(state, 'products', {})},
        productSequence: [...getInObject(payload, 'reference.items', []), ...getInObject(state, 'productSequence', [])],
        contracts: [...getInObject(payload, 'reference.contracts', []), ...getInObject(state, 'contracts', [])],
        licenses: [...getInObject(payload, 'reference.licenses', []), ...getInObject(state, 'licenses', [])],
        invalidProducts: getInObject(payload, 'invalidProducts', []),
        numberOFPartsAdded: Object.keys(getInObject(payload, 'products', {})).length,
        hasDEP: payload.hasDEP,
      }
    case ADD_TO_PERSONAL_PRODUCTS_FAILED:      
      return {
        ...state,
        invalidProducts: payload,
        hasDEP: false,
      }
    case GET_PERSONAL_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: getInObject(payload, 'products', {}),
        productSequence: selector_productsInSequence(getInObject(payload, 'reference.items', [])),
        contracts: getInObject(payload, 'reference.contracts', []),
        licenses: getInObject(payload, 'reference.licenses', []),
        user: getInObject(payload, 'reference.user', {}),
      }
    case DELETE_FROM_PERSONAL_PRODUCTS_SUCCESS: {
      const { id } = payload
      const { products, productSequence } = state
      const nextProducts = Object.keys(products)
        .filter(key => key !== id)
        .reduce((acc, key) => {
          acc[key] = products[key];
          return acc;
        }, {});
      const nextProductSequence = productSequence.filter(item => item.id !== id)
      return {
        ...state,
        products: nextProducts,
        productSequence: nextProductSequence,
      }
    }
    case UPDATE_PERSONAL_PRODUCTS_SEQUENCE_SUCCESS:
      return {
        ...state,
        productSequence: [...payload],
      }
    default:
      return state
  }
}

export function userData(state = { isLoading: true }, action) {
  switch (action.type) {
    case GET_USERDATA: {
      const nextState = { isLoading: true }
      return nextState
    }
    case SAVE_USERDATA: {
      const nextState = action.payload
      return nextState
    }
    default:
      return state
  }
}
