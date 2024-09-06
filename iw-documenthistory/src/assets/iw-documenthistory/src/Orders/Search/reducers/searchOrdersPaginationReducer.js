import { SAVE_ORDERS_PAGE_RESPONSE } from '../types'

export default function searchOrdersPagination(state = {}, { type, payload }) {
  switch (type) {
    case SAVE_ORDERS_PAGE_RESPONSE:
      return {
        ...state,
        ...payload,
      }

    default:
      return state
  }
}
