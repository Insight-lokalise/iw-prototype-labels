import React, { Fragment } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import PropTypes from 'prop-types'

import {
  CARRIER,
  CARRIER_STATUS,
  ESTIMATED_DELIVERY_DATE,
  SHIPPING_DATE,
  TRACKING_NUMBER,
  SIGNED_BY,
  ESTIMATED_SHIPPING_DATE,
} from '../../../constants/Constants'

/**
 * Represents the tracking information headers.
 */
export default function ItemTrackingHeader({ sortedOrder, isEMEA }) {
  return (
    <div className="row collapse expanded">
      <div className="columns small-12 large-2 item-tracking__label">{t(TRACKING_NUMBER)}</div>
      {!isEMEA && (<Fragment>
        <div className="columns small-12 large-1 item-tracking__label">{t(CARRIER)}</div>
        <div className="columns small-12 large-2 item-tracking__label">{t(CARRIER_STATUS)}</div>
      </Fragment>)}
      <div className="columns small-12 large-2 print-3 item-tracking__label">{sortedOrder || isEMEA ? t(ESTIMATED_SHIPPING_DATE) : t(SHIPPING_DATE)}</div>
      <div className="columns small-12 large-2 print-2 item-tracking__label">{t(ESTIMATED_DELIVERY_DATE)}</div>
      {!isEMEA && (<div className="columns small-12 large-1 print-2 item-tracking__label">{t(SIGNED_BY)}</div>)}
      <div className="columns small-12 large-2 hide-for-print item-tracking__label" />
    </div>
  )
}

ItemTrackingHeader.propTypes = {
  sortedOrder: PropTypes.bool.isRequired,
  isEMEA: PropTypes.bool.isRequired,
}