import { LOAD_INSIGHT_APPLICATION_DATA } from './types'

export default function insightApplicationData(state = {}, { type, payload }) {
  switch (type) {
    case LOAD_INSIGHT_APPLICATION_DATA:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}
