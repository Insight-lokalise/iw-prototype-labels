import InitialState from '../../../config/initialState'
import { GET_ORDER_DETAILS } from '../types'

export default function order(state = InitialState.orderDetail.order, { type, payload }) {
  switch (type) {
    case GET_ORDER_DETAILS: {
      return {
        ...payload.data,
      }
    }

    default:
      return state
  }
}
