import React from 'react'
import PropTypes from 'prop-types'

import { IWTooltip } from '../'

export default function IWInfoIcon(props) {
  return (
    <IWTooltip tooltip={props.tooltip} className={props.className}>
      <span className="ion-information-circled help-icon__icon" />
    </IWTooltip>
  )
}

IWInfoIcon.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
}

IWInfoIcon.defaultProps = {
  className: '',
}
