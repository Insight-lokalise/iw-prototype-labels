import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { IWAnchor } from '../'

/**
 * A tab that changes the slected time frame when clicked
 * @param {object} props
 */
export default function TimeFrameSelection(props) {
  const { onClick, selected, text, isLink } = props
  return isLink ? (
    <IWAnchor
      onClick={onClick}
      className={cn('iw-time-frame-selector__tab', { 'iw-time-frame-selector__tab--selected': selected })}
    >
      {text}
    </IWAnchor>
  ) : (
    <div className={cn('iw-time-frame-selector__tab', { 'iw-time-frame-selector__tab--selected': selected })}>
      {text}
    </div>
  )
}

TimeFrameSelection.propTypes = {
  isLink: PropTypes.bool,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  text: PropTypes.string.isRequired,
}

TimeFrameSelection.defaultProps = {
  isLink: true,
  onClick: () => null,
  selected: false,
}
