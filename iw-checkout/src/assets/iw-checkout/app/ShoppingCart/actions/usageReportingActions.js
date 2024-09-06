import { reportZeroUsage as _reportZeroUsage, usageReportingHistory } from './../../../libs/models/Cart/usageReporting'
import { REPORT_ZERO_USAGE, GET_USAGE_REPORT_HISTORY } from './../../libs/constants'
import { receiveCartResponse } from './../../../libs/businessContainerApps/cart/actions'

export function getUsageReportingHistory(splaDetails, webGroupPermissions) {
    return dispatch => {
        return dispatch({
            type: GET_USAGE_REPORT_HISTORY,
            payload: usageReportingHistory(splaDetails, webGroupPermissions),
        })
    }
}

export function reportZeroUsage(usageReportDetails) {
    return dispatch => {
        dispatch({
            type: REPORT_ZERO_USAGE,
            payload: _reportZeroUsage(usageReportDetails)
                .then(({ cart }) => {
                    dispatch(receiveCartResponse(cart))
                }),
        })
    }
}
