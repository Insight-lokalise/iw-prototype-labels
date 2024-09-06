import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import { IWAnchor } from '../'

/** Displays year for month calendar and allows user to change year */
export default function YearSelector(props) {
  const { allowYearDecrement, allowYearIncrement, hideYearArrows, onChange, year } = props

  const showDisabledDecrementArrow = !hideYearArrows && !allowYearDecrement
  const showEnabledDecrementArrow = !hideYearArrows && allowYearDecrement
  const showDisabledIncrementArrow = !hideYearArrows && !allowYearIncrement
  const showEnabledIncrementArrow = !hideYearArrows && allowYearIncrement

  return (
    <div className="row align-middle align-justify">
      <div className="columns small-2">
        {showEnabledDecrementArrow && (
          <IWAnchor className="ion-chevron-left iw-month-picker__arrow-link" onClick={() => onChange(year - 1)}>
            <span className="show-for-sr">{t('Go back a year')}</span>
          </IWAnchor>
        )}
        {showDisabledDecrementArrow && <span className="ion-chevron-left iw-month-picker__arrow-link--disabled" />}
      </div>
      <div className="columns iw-month-picker__year">{year}</div>
      <div className="columns small-2 text-right">
        {showEnabledIncrementArrow && (
          <IWAnchor className="ion-chevron-right iw-month-picker__arrow-link" onClick={() => onChange(year + 1)}>
            <span className="show-for-sr">{t('Go forward a year')}</span>
          </IWAnchor>
        )}
        {showDisabledIncrementArrow && <span className="ion-chevron-right iw-month-picker__arrow-link--disabled" />}
      </div>
    </div>
  )
}

YearSelector.propTypes = {
  allowYearDecrement: PropTypes.bool,
  allowYearIncrement: PropTypes.bool,
  hideYearArrows: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
}

YearSelector.defaultProps = {
  allowYearDecrement: true,
  allowYearIncrement: true,
  hideYearArrows: false,
}
