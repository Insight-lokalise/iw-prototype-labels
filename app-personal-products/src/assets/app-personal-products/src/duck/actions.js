import {
  ADD_TO_PERSONAL_PRODUCTS_SUCCESS,
  ADD_TO_PERSONAL_PRODUCTS_FAILED,
  DELETE_FROM_PERSONAL_PRODUCTS_SUCCESS,
  GET_PERSONAL_PRODUCTS_SUCCESS,
  UPDATE_PERSONAL_PRODUCTS_SEQUENCE_SUCCESS,
} from './types'

export function addToPersonalProductsSuccess(data) {
  return {
    type: ADD_TO_PERSONAL_PRODUCTS_SUCCESS,
    payload: data,
  }
}

export function addToPersonalProductsFailure(data) {
  return {
    type: ADD_TO_PERSONAL_PRODUCTS_FAILED,
    payload: data,
  }
}

export function getPersonalProductsSuccess(data) {
  return {
    type: GET_PERSONAL_PRODUCTS_SUCCESS,
    payload: data,
  }
}

export function removeFromPersonalProductsSuccess(data) {
  return {
    type: DELETE_FROM_PERSONAL_PRODUCTS_SUCCESS,
    payload: data,
  }
}

export function updatePersonalProductsSequenceSuccess(data) {
  return {
    type: UPDATE_PERSONAL_PRODUCTS_SEQUENCE_SUCCESS,
    payload: data,
  }
}
