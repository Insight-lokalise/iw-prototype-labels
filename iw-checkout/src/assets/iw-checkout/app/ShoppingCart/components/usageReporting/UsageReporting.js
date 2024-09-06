import { connect } from 'react-redux'

import {
    selector_shoppingCartView,
    selectSPLADetails,
    selector_enrollmentId,
    selector_disableNextPageDueToUsageReporting,
    selector_conflictEnrollments,
} from './../../../../libs/Cart/selectors'
import { reportZeroUsage, getUsageReportingHistory } from './../../actions/usageReportingActions'
import { selector_webGroupPermissions } from './../../../../libs/User/selectors'
import UsageReporting from './UsageReportingView'

export default connect(mapStateToProps, mapDispatchToProps)(UsageReporting)

function mapStateToProps(state) {
    return {
        hasUsagePeriodReportableNonReportable: state.cart && state.cart.hasUsagePeriodReportableNonReportable,
        splaDetails: selectSPLADetails(state),
        webLoginProfile: state.cart.webLoginProfile || null,
        usageReportingHistory: selector_shoppingCartView(state).usageReporting || {},
        enrollmentId: selector_enrollmentId(state) || NaN,
        disableNextPageDueToUsageReporting: selector_disableNextPageDueToUsageReporting(state),
        webGroupPermissions: selector_webGroupPermissions(state),
        hasConflictEnrollment: state.cart && state.cart.hasConflictEnrollment,
        conflictEnrollments: selector_conflictEnrollments(state) || null
    }
}

function mapDispatchToProps(dispatch) {
    return {
        reportZeroUsage(usageReportDetails) {
            dispatch(reportZeroUsage(usageReportDetails))
        },
        getUsageReportingHistory(splaDetails, webGroupPermissions) {
            if (!splaDetails.hasUsageReportableSoftware) return Promise.reject()
            return dispatch(getUsageReportingHistory(splaDetails, webGroupPermissions))
        },
    }
}
