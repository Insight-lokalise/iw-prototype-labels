import InitialState from './../../../config/initialState'
import { selector_simplifiedSearch } from '../selectors/simpleSearchSelectors'

import { UPDATE_QUERY, CLEAR_QUERY, SET_IS_INIT } from './../types'

export default function simplifiedSearch(state = selector_simplifiedSearch(InitialState), { type, payload }) {
  switch (type) {
    case CLEAR_QUERY:
      return {
        ...state,
        ...selector_simplifiedSearch(InitialState),
      }
    case UPDATE_QUERY:
      return {
        ...state,
        isInit: false,
        query: { ...state.query, ...payload },
      }
    case SET_IS_INIT:
      return {
        ...state,
        isInit: payload
      }
    default:
      return state
  }
}
