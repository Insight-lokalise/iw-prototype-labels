import pick from 'lodash-es/pick'

import initialState from '../../config/initialState'

export default function insight(state = initialState.insight) {
  const nextInsightState = pick(window.Insight, ['locale', 'envConfigs', 'ipsUser', 'eightHundredNumber'])
  return {
    ...state,
    ...nextInsightState,
  }
}
