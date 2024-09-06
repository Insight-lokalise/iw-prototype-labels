import React from 'react'
import PropTypes from 'prop-types'
import { IWAddress } from '../../../../libs/iw-components'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'

import ItemsList from '../ItemsList/ItemsList'
import CustomerDetailsTab from '../../containers/CustomerDetailsTab/CustomerDetailsTab'
import { Address } from '@insight/toolkit-react'

/**
 * Parent view for the 'Order details' tab
 */
export default function OrderDetailsTabView(props) {
  const {
    accountName,
    accountNumber,
    billingAddress,
    billingAttn,
    billingCompany,
    cmsServer,
    currencyCode,
    hasInvoicingEnabled,
    isAPAC,
    isEMEA,
    isLoggedIn,
    orderDetails,
    salesDocumentNumber,
    shippingAddress,
    shippingAttn,
    shippingCompany,
    getDEPInfo,
    salesAreaId
  } = props

  return (
    <div>
      <div className={cn('show-for-print', { hide: !isLoggedIn })}>
        <h3 className="order-details-tab__title">{t('Customer details')}</h3>
        <CustomerDetailsTab />
      </div>
      {isLoggedIn && (
        <div className="row collapse expanded order-details-tab">
          <div className="columns small-12 medium-12 large-12 order-details-tab__block">
            <p>
              {t('Account:')} {accountName} / {accountNumber}
            </p>
          </div>
          <div className="columns small-12 medium-6 large-4 order-details-tab__block">
            <h3 className="order-details-tab__heading">{t('Shipped to')}:</h3>
            <p className="order-details-tab__attn" data-private="true">
              {shippingCompany}
              {shippingAttn && (
                <span>
                  <br />
                  {t('Attn:')} {shippingAttn}
                </span>
              )}
            </p>
            <Address address={{...shippingAddress, zipcode: shippingAddress?.zipCode, country: shippingAddress?.countryId}} />
          </div>
          <div className="columns small-12 medium-6 large-4 order-details-tab__block">
            <h3 className="order-details-tab__heading">{t('Billed to')}:</h3>
            <p className="order-details-tab__attn" data-private="true">
              {billingCompany}
              {billingAttn && (
                <span>
                  <br />
                  {t('Attn:')} {billingAttn}
                </span>
              )}
            </p>
            <Address address={{...billingAddress, zipcode: billingAddress?.zipCode, country: billingAddress?.countryId}} />
          </div>
        </div>
      )}
      <ItemsList
        cmsServer={cmsServer}
        currencyCode={currencyCode}
        hasInvoicingEnabled={hasInvoicingEnabled}
        isAPAC={isAPAC}
        isEMEA={isEMEA}
        isLoggedIn={isLoggedIn}
        orderDetails={orderDetails}
        orderNumber={salesDocumentNumber}
        getDEPInfo={getDEPInfo}
        salesAreaId={salesAreaId}
      />
    </div>
  )
}

OrderDetailsTabView.propTypes = {
  accountName: PropTypes.string.isRequired,
  accountNumber: PropTypes.number.isRequired,
  billingAddress: PropTypes.shape({
    // key value pairs
  }), // sometimes orders do not have billing addresses
  billingAttn: PropTypes.string.isRequired,
  billingCompany: PropTypes.string.isRequired,
  cmsServer: PropTypes.string.isRequired,
  currencyCode: PropTypes.string.isRequired,
  hasInvoicingEnabled: PropTypes.bool.isRequired,
  isAPAC: PropTypes.bool.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  orderDetails: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
  salesDocumentNumber: PropTypes.number.isRequired,
  shippingAddress: PropTypes.shape({
    // key value pairs
  }).isRequired,
  shippingAttn: PropTypes.string.isRequired,
  shippingCompany: PropTypes.string.isRequired,
  salesAreaId: PropTypes.number.isRequired,
  getDEPInfo: PropTypes.func.isRequired,
}
