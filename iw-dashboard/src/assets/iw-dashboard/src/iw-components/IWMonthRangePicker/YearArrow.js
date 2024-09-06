import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from "@insight/toolkit-utils"

import { IWAnchor } from '../'

export default function YearArrow(props) {
  const { isBackArrow, enabled, handleClick } = props
  const screenReaderText = isBackArrow ? t('Go back a year') : t('Go forward a year')
  return (
    <div
      className={cn(
        'columns',
        'small-12',
        'small-order-1',
        'iw-month-picker__arrow',
        `iw-month-picker__arrow--${isBackArrow ? 'back' : 'forward'}`
      )}
    >
      <IWAnchor
        className={cn(
          { hide: !enabled, 'ion-chevron-left': isBackArrow, 'ion-chevron-right': !isBackArrow },
          'iw-month-picker__arrow-link--rotate',
          'iw-month-picker__arrow-link'
        )}
        onClick={handleClick}
      >
        <span className="show-for-sr">{screenReaderText}</span>
      </IWAnchor>
      <span
        className={cn(
          { hide: enabled, 'ion-chevron-left': isBackArrow, 'ion-chevron-right': !isBackArrow },
          'iw-month-picker__arrow-link--rotate',
          'iw-month-picker__arrow-link--disabled'
        )}
      />
    </div>
  )
}

YearArrow.propTypes = {
  enabled: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  isBackArrow: PropTypes.bool,
}

YearArrow.defaultProps = {
  isBackArrow: false,
}
