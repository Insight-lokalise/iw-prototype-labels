import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

import { getFormattedDate, getFormattedUTCDate } from '../ItemCard/ItemTracking/helpers/itemTracking'

export default function ShipmentCardHeader({ shipment, isEMEA }) {
  const {
    actualDeliveryDate,
    carrierName,
    estDeliveryDate,
    estShippingDate,
    shippingDate,
    shippingMethod,
    shippingStatus,
  } = shipment

  const isEstimatedShipping = !shippingDate && !!estShippingDate
  const deliveryDate =
    (actualDeliveryDate && new Date(actualDeliveryDate)) || (estDeliveryDate && new Date(estDeliveryDate)) || ''
  const convertedShippingDate =
    (shippingDate && new Date(shippingDate)) || (estShippingDate && new Date(estShippingDate)) || ''
  const formattedShippingDate = getFormattedUTCDate(convertedShippingDate)
  const formattedDeliveryDate = getFormattedUTCDate(deliveryDate)
  const isDeliveryShipped = shippingStatus === 'Complete' || shippingStatus === 'Partially shipped'
  //For EMEA, don't show carrier name when shippingMethod is empty
  const showCarrierName = !isEMEA && carrierName
  return (
    <div className="row collapse expanded shipment-card-header">
      <div className="columns small-12 large-4">
        <div className="row expanded shipment-card-header__row shipment-card-header__row--highlight">
          <div className="columns small-6 medium-7 large-12">
            <span className="shipment-card-header__label">{t('Shipping date')}</span>
          </div>
          <div className="columns small-6 medium-5 large-12">
            {convertedShippingDate ? (
              <span className="shipment-card-header__value">
                {formattedShippingDate}{' '}
                {(!isDeliveryShipped && isEstimatedShipping && (
                  <span className="shipment-card-header__highlight">{t('(Estimated)')}</span>
                )) ||
                  ''}
              </span>
            ) : (
              <span className="shipment-card-header__value">{t('Not yet available')}</span>
            )}
          </div>
        </div>
      </div>
      <div className="columns small-12 large-3">
        <div className="row expanded shipment-card-header__row">
          <div className="columns small-6 medium-7 large-12">
            <span className="shipment-card-header__label">{t('Shipping Status')}</span>
          </div>
          <div className="columns small-6 medium-5 large-12">
            <span className="shipment-card-header__value shipment-card-header__value--status">
              {/* TODO: If onHold we need an On hold reason. */}
              {t(shippingStatus)}
            </span>
          </div>
        </div>
      </div>
      <div className="columns small-12 large-3">
        <div className="row expanded shipment-card-header__row">
          <div className="columns small-6 medium-7 large-12">
            <span className="shipment-card-header__label">{t('Estimated delivery date')}</span>
          </div>
          <div className="columns small-6 medium-5 large-12">
            <span className="shipment-card-header__value">{formattedDeliveryDate || t('TBD')}</span>
          </div>
        </div>
      </div>
      {shippingMethod != "XD" &&
        <div className="columns small-12 large-2">
          <div className="row expanded shipment-card-header__row">
            <div className="columns small-6 medium-7 large-12">
              <span className="shipment-card-header__label">{t('Shipping method')}</span>
            </div>
              <div className="columns small-6 medium-5 large-12">
                <span className="shipment-card-header__value">{shippingMethod || showCarrierName || t('TBD')}</span>
              </div>
          </div>
        </div>
      }
    </div>
  )
}

ShipmentCardHeader.propTypes = {
  shipment: PropTypes.shape({
    actualDeliveryDate: PropTypes.number,
    estDeliveryDate: PropTypes.number,
    estShippingDate: PropTypes.number,
    shippingDate: PropTypes.number,
    shippingMethod: PropTypes.string,
    shippingStatus: PropTypes.string.isRequired,
  }).isRequired,
  isEMEA: PropTypes.bool.isRequired
}
