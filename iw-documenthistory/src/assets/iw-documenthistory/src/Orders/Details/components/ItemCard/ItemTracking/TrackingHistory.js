import React from 'react'
import PropTypes from 'prop-types'
import { groupBy, orderBy } from 'lodash'
import { IWModalLink } from '../../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

import { getFormattedUTCDate, getFormattedUTCTime, renderPODLink } from './helpers/itemTracking'
import { PROOF_DELIVERY, TRACKING_HISTORY } from '../../../constants/Constants'

export default function TrackingHistory({
  trackingNumber,
  trackingHistoryList,
  sapLineItemNumber,
  podAvailable,
  orderNumber,
}) {
  const dateTimeTrackingHistoryList = trackingHistoryList.map(item => {
    return {
      localDate: getFormattedUTCDate(new Date(item.localTimestamp)),
      localTime: getFormattedUTCTime(new Date(item.localTimestamp)),
      ...item,
    }
  })

  const displayTrackingHistoryObj = groupBy(dateTimeTrackingHistoryList, 'localDate')

  function renderTrackingHistory() {
    return (
      <div className="tracking-history">
        {podAvailable && (
          <div className="row">
            <div className="columns large-12">
              {podAvailable && renderPODLink(t(PROOF_DELIVERY), orderNumber, sapLineItemNumber)}
            </div>
          </div>
        )}
        {renderDateGroups(displayTrackingHistoryObj)}
      </div>
    )
  }

  function renderDateGroups() {
    return Object.keys(displayTrackingHistoryObj).map(key => (
      <div key={key}>
        <div className="row">
          <div className="columns large-12">
            <h4 className="tracking-history__date-header">{key}</h4>
          </div>
        </div>
        {renderHistoryItems(displayTrackingHistoryObj[key])}
      </div>
    ))
  }

  function renderHistoryItems(items) {
    const orderedList = orderBy(items, 'localTimestamp', 'desc')
    return orderedList.map(({ localTime, localTimestamp, description, location, status }) => (
      <div className="row" key={localTimestamp}>
        <div className="columns large-2 tracking-history__label">{localTime}</div>
        <div className="columns large-2 tracking-history__label">{t(status)}</div>
        <div className="columns large-3 tracking-history__label">
          {location?.city} {location?.stateProvince} {location?.countryCode}
        </div>
        <div className="columns large-5 tracking-history__label">{description}</div>
      </div>
    ))
  }

  return (
    <IWModalLink
      linkClassName="orders__link"
      hideCancelBtn
      hideConfirmBtn
      onConfirm={() => {}}
      linkMarkup={
        <span>
          <span className="orders__link-text">{trackingNumber}</span>
        </span>
      }
      modalSize="large"
      modalTitle={t(TRACKING_HISTORY)}
      modalBody={renderTrackingHistory()}
    />
  )
}

TrackingHistory.propTypes = {
  trackingNumber: PropTypes.string.isRequired,
  trackingHistoryList: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      localTimestamp: PropTypes.number.isRequired,
      location: PropTypes.shape({
        city: PropTypes.string,
        countryCode: PropTypes.string,
        stateProvince: PropTypes.string,
      }).isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  sapLineItemNumber: PropTypes.string.isRequired,
  podAvailable: PropTypes.bool.isRequired,
  orderNumber: PropTypes.number.isRequired,
}
