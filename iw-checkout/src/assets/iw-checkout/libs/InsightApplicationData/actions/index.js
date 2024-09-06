import * as InsightApplicationData from '../../models/InsightApplicationData'
import { LOAD_INSIGHT_APPLICATION_DATA } from './../constants'

export function loadInsightApplicationData() {
    return dispatch => {
        InsightApplicationData.loadInsightApplicationData()
            .then(applicationConfig => {
                dispatch({
                    type: LOAD_INSIGHT_APPLICATION_DATA,
                    payload: applicationConfig,
                })
            })
    }
}
