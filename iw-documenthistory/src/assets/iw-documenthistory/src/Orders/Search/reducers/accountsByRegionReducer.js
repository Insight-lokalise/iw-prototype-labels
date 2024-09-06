import InitialState from './../../../config/initialState'
import { selector_accountsByRegion } from '../selectors/simpleSearchSelectors'

import { GET_REGIONS_BYBILLTO, GET_HIERARCHYTREE_DROPDOWN } from './../types'

export default function accountsByRegion(state = selector_accountsByRegion(InitialState), { type, payload }) {
  switch (type) {
    case GET_REGIONS_BYBILLTO:
      return {
        ...state,
        operationCenters: payload.map(item => item),
      }
    case GET_HIERARCHYTREE_DROPDOWN:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}
