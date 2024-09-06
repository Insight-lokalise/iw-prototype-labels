import React from 'react'
import PropTypes from 'prop-types'

import { IWTooltip } from '../'

export default function IWHelpIcon(props) {
  return (
    <IWTooltip tooltip={props.tooltip} className={props.className}>
      <span className="ion-help-circled help-icon__icon" />
    </IWTooltip>
  )
}

IWHelpIcon.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

IWHelpIcon.defaultProps = {
  className: '',
}
