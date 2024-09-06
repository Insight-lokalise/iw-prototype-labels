import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import PropTypes from 'prop-types'

export default function LineItemInformation({
  contractReportingField,
  contractTextLineItem,
  countryOfUsage,
  smartTrackers,
}) {
  const hasContractReportingFields = !!contractReportingField.length
  const hasContractTextLineItem = !!contractTextLineItem.length
  const hasSmartTrackers = !!smartTrackers.length

  return (
    <div className="line-item-info">
      <h3 className="line-item-info__heading">{t('Line level information')}</h3>
      {countryOfUsage && (
        <div>
          <h4 className="line-item-info__subheading">{t('License information')}</h4>
          <div className="row collapse expanded">
            <div className="columns small-6 large-4">
              <span className="line-item-info__label">{t('Country of usage')}:</span>
            </div>
            <div className="columns small-6 large-4">
              <span className="line-item-info__value">{countryOfUsage}</span>
            </div>
          </div>
        </div>
      )}
      {hasSmartTrackers && (
        <div>
          <h4 className="line-item-info__subheading">{t('SmartTracker')}</h4>
          {smartTrackers.map(({ name, value }) => (
            <div>
              <div className="row collapse expanded">
                <div className="columns small-6 large-4">
                  <span className="line-item-info__label">{name}</span>
                </div>
                <div className="columns small-6 large-4">
                  <span className="line-item-info__value">{value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {hasContractReportingFields && (
        <div>
          <h4 className="line-item-info__subheading">{t('Contract Specific Info')}</h4>
          {contractReportingField.map(({ name, value }) => (
            <div className="row collapse expanded">
              <div className="columns small-6 large-4">
                <span className="line-item-info__label">{name}</span>
              </div>
              <div className="columns small-6 large-4">
                <span className="line-item-info__value">{value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {hasContractTextLineItem && (
        <div>
          {contractTextLineItem.map(textValue => (
            <span className="line-item-info__value">{textValue}</span>
          ))}
        </div>
      )}
    </div>
  )
}

LineItemInformation.propTypes = {
  contractReportingField: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  contractTextLineItem: PropTypes.arrayOf(PropTypes.string),
  countryOfUsage: PropTypes.string.isRequired,
  smartTrackers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      value: PropTypes.string,
    })
  ),
}

LineItemInformation.defaultProps = {
  contractReportingField: [],
  contractTextLineItem: [],
  smartTrackers: [],
}
