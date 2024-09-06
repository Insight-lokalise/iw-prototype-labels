import {
  CLEAR_QUERY,
  UPDATE_QUERY,
  SET_IS_INIT,
} from '../types'

export function updateQuery(query) {
  return {
    type: UPDATE_QUERY,
    payload: query,
  }
}

export function setIsInit(isInit) {
  return {
    type: SET_IS_INIT,
    payload: isInit,
  }
}

export function clearSearch() {
  return {
    type: CLEAR_QUERY,
  }
}
