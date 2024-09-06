import React from 'react'
import PropTypes from 'prop-types'

import { IWTooltip } from './iw-tooltip'

export function IWHelpIcon(props) {
    return (
        <IWTooltip tooltip={props.tooltip} className={props.className}>
            <span className="ion-help-circled help-icon__icon" />
        </IWTooltip>
    )
}

IWHelpIcon.propTypes = {
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    className: PropTypes.string,
}
