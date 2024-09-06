import { GET_GENERICORDER_SEARCH } from './../types'

export default function genericOrderHistoryResults(state = {}, { type, payload }) {
  switch (type) {
    case GET_GENERICORDER_SEARCH:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}
