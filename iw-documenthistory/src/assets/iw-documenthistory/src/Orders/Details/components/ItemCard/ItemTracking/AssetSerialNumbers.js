import React from 'react'
import PropTypes from 'prop-types'
import groupBy from 'lodash/groupBy'
import { IWModalLink } from '../../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

function getMaterialId(assetAndSerialNumbers) {
  return assetAndSerialNumbers.find(item => item.materialId).materialId || ''
}

export default function AssetSerialNumbers({ assetAndSerialNumbers }) {
  const hasDescriptions = assetAndSerialNumbers.some(item => !!item.description)
  const byDescription = hasDescriptions
    ? Object.entries(groupBy(assetAndSerialNumbers, 'description'))
    : [['', assetAndSerialNumbers]]
  return (
    <IWModalLink
      linkClassName="orders__link hide-for-print"
      hideCancelBtn
      hideConfirmBtn
      onConfirm={() => {}}
      linkMarkup={
        <span>
          <span className="orders__link-text">{t('Asset/Serial numbers')}</span>
          <span className="orders__ion-icon orders__ion-icon--right ion-ios-list-outline" />
        </span>
      }
      modalSize="small"
      modalTitle={t('Asset/Serial numbers')}
      modalBody={byDescription.map(([description, assetAndSerials], index) => (
        <div className="row asset-serial-numbers" key={description + index}>
          {description && (
            <div className="columns small-12">
              <h4 className="asset-serial-numbers__description">
                {getMaterialId(assetAndSerials)} - {description}
              </h4>
            </div>
          )}
          <div className="columns small-6">
            <span className="asset-serial-numbers__label">{t('Asset number')}</span>
            {assetAndSerials.map(({ assetTag, serialNumber }) => (
              <span className="asset-serial-numbers__value" key={assetTag + serialNumber}>
                {assetTag}
              </span>
            ))}
          </div>
          <div className="columns small-6">
            <span className="asset-serial-numbers__label">{t('Serial number')}</span>
            {assetAndSerials.map(({ assetTag, serialNumber }) => (
              <span className="asset-serial-numbers__value" key={assetTag + serialNumber}>
                {serialNumber}
              </span>
            ))}
          </div>
        </div>
      ))}
    />
  )
}

AssetSerialNumbers.propTypes = {
  assetAndSerialNumbers: PropTypes.arrayOf(
    PropTypes.shape({
      serialNumber: PropTypes.string.isRequired,
      assetTag: PropTypes.string.isRequired,
    })
  ).isRequired,
}
