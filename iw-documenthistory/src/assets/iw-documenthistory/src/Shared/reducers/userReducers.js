/* eslint-disable import/prefer-default-export */
import { GET_USERDATA, SAVE_USERDATA } from '../types'

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
