import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { IWAnchor } from '../'

/**
 * used to display a user's selection of a month. All references to months are zero-based integers from 0-11
 * @param {object} props
 */
export default function MonthSelectionDisplay(props) {
  const { displayText, isActive, onClick } = props
  return (
    <div className="columns small-6">
      <IWAnchor
        className={cn('iw-month-picker__selection', {
          'iw-month-picker__selection--active': isActive,
        })}
        onClick={onClick}
      >
        {displayText}
      </IWAnchor>
    </div>
  )
}

MonthSelectionDisplay.propTypes = {
  isActive: PropTypes.bool,
  displayText: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

MonthSelectionDisplay.defaultProps = {
  isActive: true,
  onClick: () => null,
}
