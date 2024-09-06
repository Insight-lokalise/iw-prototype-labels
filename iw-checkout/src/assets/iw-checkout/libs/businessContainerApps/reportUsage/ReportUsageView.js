import React from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'


export default function ReportUsageView(props) {
    const reportUsageText = t('Report usage for:')
    const enrollmentNumberText = t('Enrollment #:')
    return (
        <div className="row is-collapse-child expanded usage-reporting usage-reporting--summary">
            <div className="column">
                <div className="row row__gutter--tiny collapse expanded">
                    <span className="column shrink">
                        {reportUsageText}
                    </span>
                    <span className="column">
                        <strong>
                            {props.usageDate}
                        </strong>
                    </span>
                    <div className="column small-12 medium-shrink medium-text-right">
                        {`${enrollmentNumberText} `}
                        <strong>
                            {props.enrollmentID}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    )
}


ReportUsageView.propTypes = {
    enrollmentID: PropTypes.string.isRequired,
    usageDate: PropTypes.string.isRequired,
}


ReportUsageView.defaultProps = {
    enrollmentID: 'PropTypes.string.isRequired',
    usageDate: 'PropTypes.string.isRequired',
}
