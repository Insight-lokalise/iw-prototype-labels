import React from 'react'
import PropTypes from 'prop-types'
import { IWAnchor } from '../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

import CustomerDetail from './CustomerDetail'
import { GET_PAYMENT_TYPES, GET_CREDIT_STATUS } from '../../types'
import SmartTracker from './SmartTracker'

/**
 * Works as a wrapper for every customer detail displayed in the CustomerDetailsTabView tab.
 */
export default function CustomerDetailsTabView({
  creditStatus,
  email,
  attachedFile,
  isSEWP,
  name,
  orderSmartTracker,
  paymentType,
  phone,
  poNumber,
  poReleaseNumber,
  soldTo,
}) {
  return (
    <div className="customer-details-tab">
      {attachedFile && (
        <IWAnchor
          target="_blank"
          href={attachedFile}
          className="orders__link orders__link--inline-block customer-details-tab__link hide-for-print"
        >
          <span className="orders__ion-icon orders__ion-icon--left ion-paperclip" />
          <span className="orders__link-text">{t('Click to view or download attachment')}</span>
        </IWAnchor>
      )}
      <div className="row collapse expanded">
        <div className="columns small-12 large-6 customer-details-tab__block" data-private="true">
          <CustomerDetail label={t('Contact Name')} value={name} />
          <CustomerDetail label={t('Contact email')} value={email} />
          <CustomerDetail label={t('Contact phone')} value={phone} />
          <CustomerDetail label={t('Account number')} value={soldTo} />
        </div>
        <div className="columns small-12 large-6 customer-details-tab__block">
          <CustomerDetail label={t('PO number')} value={poNumber} />
          <CustomerDetail label={isSEWP ? t('STN') : t('PO release number')} value={poReleaseNumber} />
          <CustomerDetail label={t('Payment type')} value={t(GET_PAYMENT_TYPES[paymentType])} />
          <CustomerDetail label={t('Credit status')} value={t(GET_CREDIT_STATUS[creditStatus])} />
        </div>
      </div>
      <SmartTracker orderSmartTracker={orderSmartTracker} />
    </div>
  )
}

CustomerDetailsTabView.propTypes = {
  attachedFile: PropTypes.string.isRequired,
  creditStatus: PropTypes.string,
  email: PropTypes.string.isRequired,
  isSEWP: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  orderSmartTracker: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  paymentType: PropTypes.string,
  phone: PropTypes.string.isRequired,
  poNumber: PropTypes.string,
  poReleaseNumber: PropTypes.string,
  soldTo: PropTypes.number.isRequired,
}

CustomerDetailsTabView.defaultProps = {
  creditStatus: null,
  orderSmartTracker: [],
  paymentType: null,
  poNumber: '',
  poReleaseNumber: '',
}
