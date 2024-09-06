import React from 'react'
import PropTypes from 'prop-types'
import groupBy from 'lodash/groupBy'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function PrintAssetSerialNumbers({ assetAndSerialNumbers }) {
  const hasDescriptions = assetAndSerialNumbers.some(item => !!item.description)
  const byDescription = hasDescriptions
    ? Object.entries(groupBy(assetAndSerialNumbers, 'description'))
    : [['', assetAndSerialNumbers]]
  return (
    <div className="show-for-print print-asset-serial-numbers">
      <h4 className="print-asset-serial-numbers__heading">{t('Asset/Serial numbers')}</h4>
      {byDescription.map(([description, assetAndSerials], index) => (
        <div className="row expanded asset-serial-numbers" key={description + index}>
          {description && (
            <div className="columns small-12">
              <h4 className="asset-serial-numbers__description">{description}</h4>
            </div>
          )}
          <div className="columns small-3">
            <span className="asset-serial-numbers__label">{t('Asset number')}</span>
            {assetAndSerialNumbers.map(({ serialNumber, assetTag }) => (
              <span className="asset-serial-numbers__value" key={serialNumber + assetTag}>
                {serialNumber}
              </span>
            ))}
          </div>
          <div className="columns small-3">
            <span className="asset-serial-numbers__label">{t('Serial number')}</span>
            {assetAndSerialNumbers.map(({ serialNumber, assetTag }) => (
              <span className="asset-serial-numbers__value" key={serialNumber + assetTag}>
                {assetTag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

PrintAssetSerialNumbers.propTypes = {
  assetAndSerialNumbers: PropTypes.arrayOf(
    PropTypes.shape({
      serialNumber: PropTypes.string.isRequired,
      assetTag: PropTypes.string.isRequired,
    })
  ).isRequired,
}
