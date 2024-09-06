import initialState from './../../../app/libs/initialState'
import pick from "lodash-es/pick";

export default function flags(state = initialState.flags) {
  const nextInsightState = pick(window, ['flags'])
  return {
    ...state,
    ...nextInsightState,
  }
}
