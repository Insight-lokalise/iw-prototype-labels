import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

import AssetSerialNumbers from './AssetSerialNumbers'
import TrackingHistory from './TrackingHistory'
import SortedLink from './SortedLink'
import { renderPODLink, getFormattedUTCDate } from './helpers/itemTracking'

import {
  TRACKING_NUMBER,
  CARRIER,
  CARRIER_STATUS,
  SHIPPING_DATE,
  ESTIMATED_DELIVERY_DATE,
  SIGNED_BY
} from '../../../constants/Constants'
import PrintAssetSerialNumbers from '../../Print/PrintAssetSerialNumbers'

export default function ItemTrackingLine({ isLoggedIn, isEMEA, shippingStatus, trackingInfoLine, orderNumber, salesAreaId }) {
  const {
    actualDeliveryDate,
    carrierName,
    estDeliveryDate,
    estShippingDate,
    qtyPerTracking,
    serialNumberAssetTagList,
    shippingDate,
    shippingMethod,
    status,
    totalQty,
    trackingNumber,
    trackingHistory,
    sapLineItemNumber,
    podAvailable,
    signedBy,
    consignmentNo
  } = trackingInfoLine

  const isEstimatedShipping = !shippingDate && !!estShippingDate
  const assetAndSerialNumbers = Array.isArray(serialNumberAssetTagList) ? serialNumberAssetTagList : []
  const hasSerialOrAssetNumbers =
  !!assetAndSerialNumbers.length &&
  assetAndSerialNumbers.some(assetSerialItem => !!(assetSerialItem.serialNumber || assetSerialItem.assetTag))
  const hasConsignmentNumber = consignmentNo !== null && consignmentNo !== ""
  const convertedShippingDate =
    (shippingDate && new Date(shippingDate)) || (estShippingDate && new Date(estShippingDate)) || ''
  const deliveryDate =
    (actualDeliveryDate && new Date(actualDeliveryDate)) || (estDeliveryDate && new Date(estDeliveryDate))
  const trackingHistoryList = Array.isArray(trackingHistory) ? trackingHistory : []
  const hasTrackingHistory = !!trackingHistoryList.length

  const formattedShippingDate = getFormattedUTCDate(convertedShippingDate)
  const formattedDeliveryDate = getFormattedUTCDate(deliveryDate)
  const trackingNumberLink = hasTrackingHistory ? (
    <TrackingHistory
      trackingNumber={trackingNumber}
      trackingHistoryList={trackingHistoryList}
      sapLineItemNumber={sapLineItemNumber}
      podAvailable={podAvailable}
      orderNumber={orderNumber}
    />
  ) : (
    <span className="orders__link-text">{trackingNumber === 'TBD' ? t('TBD') : trackingNumber}</span>
  )
  const isDeliveryShipped = shippingStatus === 'Complete' || shippingStatus === 'Partially shipped'

  return (
    <div>
      <div className="row collapse expanded align-middle item-tracking__row">
        <div className="columns small-12 large-2 item-tracking__value" data-label={t(TRACKING_NUMBER)}>
          {hasConsignmentNumber ? <SortedLink linkText={t('Track Your Package')} consignmentNumber={consignmentNo} salesAreaId={salesAreaId} /> : trackingNumberLink}
        </div>
        {!isEMEA && (<Fragment>
          <div className="columns small-12 large-1 item-tracking__value" data-label={t(CARRIER)}>
            {carrierName} {carrierName && shippingMethod && `-`} {shippingMethod}
          </div>
          <div className="columns small-12 large-2 item-tracking__value" data-label={t(CARRIER_STATUS)}>
            {status} {qtyPerTracking !== null ? `(${qtyPerTracking} ${t('of')} ${totalQty})` : t('TBD')}
          </div>
        </Fragment>)}
        <div className="columns small-12 large-2 print-3 item-tracking__value" data-label={t(SHIPPING_DATE)}>
          {formattedShippingDate}{' '}
          {!isDeliveryShipped && isEstimatedShipping && (
            <span className="item-tracking__highlight">{t('(Estimated)')}</span>
          )}
        </div>
        <div className="columns small-12 large-2 print-2 item-tracking__value" data-label={t(ESTIMATED_DELIVERY_DATE)}>
          {formattedDeliveryDate}
        </div>
        {!isEMEA && (
          <div className="columns small-12 large-1 print-2 item-tracking__value" data-label={t(SIGNED_BY)}>
            {podAvailable ? renderPODLink(signedBy, orderNumber, sapLineItemNumber) : signedBy}
          </div>
        )}
        {isLoggedIn && hasSerialOrAssetNumbers && (
          <div className="columns small-12 large-2 hide-for-print item-tracking__value item-tracking__value--asset">
            <AssetSerialNumbers assetAndSerialNumbers={assetAndSerialNumbers} />
          </div>
        )}
      </div>
      {/* AssetSerialNumbers component needs to be repeated because the non print version is an IWModalLink */}
      {isLoggedIn && hasSerialOrAssetNumbers && (
        <PrintAssetSerialNumbers assetAndSerialNumbers={assetAndSerialNumbers} />
      )}
    </div>
  )
}

ItemTrackingLine.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  trackingInfoLine: PropTypes.shape({
    actualDeliveryDate: PropTypes.number,
    assetNumbersList: PropTypes.arrayOf(PropTypes.string),
    carrierName: PropTypes.string,
    estDeliveryDate: PropTypes.number,
    serialNumberAssetTagList: PropTypes.array,
    serialNumbers: PropTypes.string,
    shippingDate: PropTypes.number,
    status: PropTypes.string,
    trackingNumber: PropTypes.string,
    trackingHistory: PropTypes.arrayOf(PropTypes.object),
    sapLineItemNumber: PropTypes.string.isRequired,
    podAvailable: PropTypes.bool.isRequired,
    signedBy: PropTypes.string,
  }).isRequired,
  shippingStatus: PropTypes.string.isRequired,
  orderNumber: PropTypes.number.isRequired,
  salesAreaId: PropTypes.number.isRequired,
}
