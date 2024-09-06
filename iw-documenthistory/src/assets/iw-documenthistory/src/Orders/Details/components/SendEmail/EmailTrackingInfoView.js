import React from 'react'
import PropTypes from 'prop-types'
import { t, l } from '@insight/toolkit-utils/lib/labels'
import {
  TRACKING_NUMBER,
  CARRIER,
  CARRIER_STATUS,
  SHIPPING_DATE,
  ESTIMATED_DELIVERY_DATE,
  SIGNED_BY,
} from '../../constants/Constants'

export default function EmailTrackingInfoView(props) {
  const {
    isLoggedIn,
    lineItem: {
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
      signedBy,
    },
  } = props

  const assetAndSerialNumbers = serialNumberAssetTagList || []
  const hasSerialOrAssetNumbers = !!assetAndSerialNumbers.length
  const convertedShippingDate =
    (shippingDate && new Date(shippingDate)) || (estShippingDate && new Date(estShippingDate)) || ''
  const deliveryDate =
    (actualDeliveryDate && new Date(actualDeliveryDate)) || (estDeliveryDate && new Date(estDeliveryDate)) || ''
  const isEstimatedShipping = !shippingDate && !!estShippingDate
  const isDeliveryShipped = status === 'Complete' || status === 'Partially shipped'

  function getFormattedDate(date) {
    const month = date.toLocaleString(l, { month: 'short' })
    const day = date.toLocaleString(l, { day: '2-digit' })
    const year = date.toLocaleString(l, { year: 'numeric' })
    return `${day}-${month}-${year}`
  }

  const formattedShippingDate = getFormattedDate(convertedShippingDate)
  const formattedDeliveryDate = getFormattedDate(deliveryDate)
  return (
    <tbody>
      <tr>
        <td>{t(TRACKING_NUMBER)}</td>
        <td>{trackingNumber}</td>
      </tr>
      <tr>
        <td>{t(CARRIER)}</td>
        <td>
          {carrierName} {shippingMethod && shippingMethod != "XD" && `- ${shippingMethod}`}
        </td>
      </tr>
      <tr>
        <td>{t(CARRIER_STATUS)}</td>
        <td>
          {status} ({`${qtyPerTracking} ${t('of')} ${totalQty}`})
        </td>
      </tr>
      <tr>
        <td>{t(SHIPPING_DATE)}</td>
        <td>
          {convertedShippingDate ? (
            <span>
              {formattedShippingDate} {(!isDeliveryShipped && isEstimatedShipping && t('(Estimated)')) || ''}
            </span>
          ) : (
            t('Not yet available')
          )}
        </td>
      </tr>
      <tr>
        <td>{t(ESTIMATED_DELIVERY_DATE)}</td>
        <td>{formattedDeliveryDate}</td>
      </tr>
      <tr>
        <td>{t(SIGNED_BY)}</td>
        <td>{signedBy}</td>
      </tr>
      {isLoggedIn && hasSerialOrAssetNumbers && (
        <tr>
          <td>{t('Asset number')}</td>
          <td>{t('Serial number')}</td>
        </tr>
      )}
      {isLoggedIn &&
        hasSerialOrAssetNumbers &&
        assetAndSerialNumbers.map(assetItem => (
          <tr key={assetItem.serialNumber}>
            <td>{assetItem.assetTag}</td>
            <td>{assetItem.serialNumber}</td>
          </tr>
        ))}
    </tbody>
  )
}

EmailTrackingInfoView.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  lineItem: PropTypes.shape({
    assetNumbersList: PropTypes.arrayOf(PropTypes.string),
    carrierName: PropTypes.string,
    deliveryDate: PropTypes.string,
    qtyPerTracking: PropTypes.number,
    serialNumber: PropTypes.string,
    shippingDate: PropTypes.number,
    status: PropTypes.string,
    totalQty: PropTypes.number,
    trackingNumber: PropTypes.string,
    signedBy: PropTypes.string,
  }).isRequired,
}
