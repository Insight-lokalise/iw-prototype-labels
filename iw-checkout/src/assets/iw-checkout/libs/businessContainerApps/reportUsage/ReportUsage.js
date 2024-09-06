import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { monthNames } from '../../models/Date'
import { selector_shoppingRequestCartItemUsage } from '../../ShoppingRequest/selectors'

import ReportUsageView from './ReportUsageView'


function ReportUsage(props) {
    return props.hasUsageReporting &&
        <ReportUsageView enrollmentID={props.enrollmentID} usageDate={props.usageDate} />
}


ReportUsage.propTypes = {
    hasUsageReporting: PropTypes.bool.isRequired,
}


function mapStateToProps(state) {
    const emptyString = ''
    const usage = selector_shoppingRequestCartItemUsage(state)
    const hasUsageReporting = Object.keys(usage).length > 0
    const enrollmentID = hasUsageReporting ? usage.enrollmentId : emptyString
    const usageDate = hasUsageReporting ? `${monthNames[usage.month]} ${usage.year}` : emptyString
    return {
        enrollmentID,
        hasUsageReporting,
        usageDate,
    }
}


export default connect(mapStateToProps)(ReportUsage)
