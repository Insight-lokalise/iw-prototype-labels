import * as InsightApplicationData from './model'
import { LOAD_INSIGHT_APPLICATION_DATA } from './types'

export function loadInsightApplicationData() {
  return dispatch =>
    InsightApplicationData.loadInsightApplicationData().then(appData => {
      dispatch({
        type: LOAD_INSIGHT_APPLICATION_DATA,
        payload: appData,
      })
    })
}
