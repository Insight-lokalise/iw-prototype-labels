import { SAVE_ORDERS_PAGE_RESPONSE } from '../types'

export default function saveOrdersPageResponse(serialized, data) {
  return {
    type: SAVE_ORDERS_PAGE_RESPONSE,
    payload: { [serialized]: data },
  }
}
