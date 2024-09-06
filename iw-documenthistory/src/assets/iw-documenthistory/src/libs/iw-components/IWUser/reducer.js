import { LOAD_USER } from './types'

const initialState = {
  defaultCarrier: null,
  defaultShippingAddress: null,
  isLoggedIn: false,
  userPermissions: [],
  webGroupPermissions: [],
  b2bLoginInfo: {},
  isAPAC: false,
  isNavy: false,
  navySTName: null,
}

export default function user(state = initialState, { type, payload }) {
  switch (type) {
    case LOAD_USER:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}
