import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import PropTypes from 'prop-types'
import Date from "@insight/toolkit-react/lib/Date/Date";
import { connectToLocale } from "@insight/toolkit-react";

export function DetailsTable(props) {
  const { createdOn, isLoggedIn, isSEWP, poNumber, poReleaseNumber, webReferenceNumber } = props
  const poValue = getPOorPOReleasenumber(poNumber, poReleaseNumber)
  return (
    <ul className="row expanded order-details__table orders__list orders__list--no-bullets">
      <li className="columns small-12 medium-6 large-shrink orders__list-item order-details__table-item">
        <span className="order-details__table-label">{t('Order date')}</span>
        <span className="order-details__table-value"><Date date={createdOn} type='date' /></span>
      </li>
      <li className="columns small-12 medium-6 large-shrink orders__list-item order-details__table-item">
        <span className="order-details__table-label">{t(`PO / ${isSEWP ? 'STN' : 'PO release'}`)}</span>
        <span className="order-details__table-value">{poValue}</span>
      </li>
      {isLoggedIn && (
        <li className="columns small-12 medium-6 large-shrink orders__list-item order-details__table-item">
          <span className="order-details__table-label">{t('Reference number')}</span>
          <span className="order-details__table-value">{webReferenceNumber}</span>
        </li>
      )}
    </ul>
  )
}

export function getPOorPOReleasenumber(poNum, poRelNum) {
  return poNum && poRelNum ? `${poNum}/${poRelNum}` : poNum || poRelNum || ''
}

export default connectToLocale(DetailsTable)

DetailsTable.propTypes = {
  createdOn: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  poNumber: PropTypes.string.isRequired,
  poReleaseNumber: PropTypes.string.isRequired,
  webReferenceNumber: PropTypes.number.isRequired,
  isSEWP: PropTypes.bool.isRequired,
}
