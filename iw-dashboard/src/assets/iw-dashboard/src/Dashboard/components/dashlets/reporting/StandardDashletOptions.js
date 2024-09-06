import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

import ComparisonCheckbox from './ComparisonCheckbox'
import DashletDropdowns from './DashletDropdowns'
import { IWSelect, IWButton, IWTimeFrameSelector } from '../../../../iw-components'

export default function StandardDashletOptions({
  backText,
  currencies,
  currency,
  currencyCode,
  disableComparison,
  dropdowns,
  handleBackButton,
  handleCurrencyDropdown,
  isCompared,
  timeFrameProps,
  toggleIsCompared,
}) {
  const currencyDisabled = currencies.length === 1
  const currencySelection = currencyDisabled ? currencyCode : currency
  return (
    <div>
      <div className="dashlet__period">
        <IWTimeFrameSelector {...timeFrameProps} />
        {backText && (
          <div className="row collapse align-middle dashlet__back">
            <div className="column small-2 medium-3">
              <IWButton
                className="small clear no-margin-bot ion-ios-arrow-back dashlet__back-btn"
                onClick={handleBackButton}
              >
                <span className="dashlet__back-btn-text hide-for-small-only">{t('Back')}</span>
              </IWButton>
            </div>
            <div className="column small-8 medium-6 text-center">
              <span className="dashlet__back-text">{t(backText)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="row collapse align-middle align-justify">
        <div className="column shrink medium-text-right medium-order-2">
          <ComparisonCheckbox
            isCompared={isCompared}
            toggleIsCompared={toggleIsCompared}
            disableComparison={disableComparison}
          />
        </div>
        <div className="column small-12 medium-6 medium-order-1">
          <label className="dashlet__label">
            {t('Currency:')}
            <IWSelect
              disabled={currencyDisabled}
              options={currencies}
              value={currencySelection}
              onChange={handleCurrencyDropdown}
              placeholder={currencyCode}
              className="dashlet__select dashlet__select--currency"
            />
          </label>
        </div>
      </div>
      <DashletDropdowns dropdowns={dropdowns} />
    </div>
  )
}

StandardDashletOptions.propTypes = {
  backText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  currencies: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  currency: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
  currencyCode: PropTypes.string.isRequired,
  disableComparison: PropTypes.bool,
  dropdowns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ),
      onChange: PropTypes.func.isRequired,
    })
  ),
  handleBackButton: PropTypes.func,
  handleCurrencyDropdown: PropTypes.func.isRequired,
  isCompared: PropTypes.bool.isRequired,
  timeFrameProps: PropTypes.shape({
    monthList: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    selectedStartDate: PropTypes.shape({
      year: PropTypes.number,
      month: PropTypes.number,
    }),
    selectedEndDate: PropTypes.shape({
      year: PropTypes.number,
      month: PropTypes.number,
    }),
    timeFrame: PropTypes.string,
  }).isRequired,
  toggleIsCompared: PropTypes.func.isRequired,
}

StandardDashletOptions.defaultProps = {
  backText: undefined,
  currency: undefined,
  disableComparison: false,
  dropdowns: undefined,
  handleBackButton: () => {},
}
