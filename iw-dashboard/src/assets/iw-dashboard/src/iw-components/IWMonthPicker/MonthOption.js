import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { IWAnchor } from '../'

/**
 * displays a single month in the calendar. All references to months are zero-based integers from 0-11
 * @param {object} props
 */
export default function MonthOption(props) {
  const { displayName, isDisabled, inSelectedRange, option, onClick, isSelected } = props

  return isDisabled ? (
    <div className="columns small-4 iw-month-picker__month iw-month-picker__month--disabled">{displayName}</div>
  ) : (
    <IWAnchor
      className={cn('columns small-4 iw-month-picker__month', {
        'iw-month-picker__month--in-range': !isSelected && inSelectedRange,
        'iw-month-picker__month--selected': isSelected,
      })}
      onClick={() => onClick(option)}
    >
      {displayName}
    </IWAnchor>
  )
}

MonthOption.propTypes = {
  displayName: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  inSelectedRange: PropTypes.bool,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  option: PropTypes.shape({
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
}

MonthOption.defaultProps = {
  isDisabled: false,
  inSelectedRange: false,
  isSelected: false,
}
