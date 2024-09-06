import React from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'
import PropTypes from 'prop-types'
import { Address } from '@insight/toolkit-react'
import { Panel } from '@insight/toolkit-react'

import {
  selector_payment,
  selector_additionalShippingNotificationEmail,
} from '../../state/slices/selectors/receiptSelector'

const AddressSection = ({ shipping, billing }) => {
  const payment = useSelector(selector_payment)
  const additionalShippingNotificationEmails = useSelector(selector_additionalShippingNotificationEmail)
  const billingAddress = {
    attentionLine: shipping?.attentionLine,
    company: billing?.companyName,
    address1: billing?.address?.address1,
    address2: billing?.address?.address2,
    address3: billing?.address?.address3,
    city: billing?.address?.city,
    state: billing?.address?.state,
    zipcode: billing?.address?.zipCode,
    country: billing?.address?.countryId,
    phone: billing?.phone,
  }
  
  const shippingAddress = {
    attentionLine: shipping?.attentionLine,
    company: shipping?.companyName,
    address1: shipping?.address?.address1,
    address2: shipping?.address?.address2,
    address3: shipping?.address?.address3,
    city: shipping?.address?.city,
    state: shipping?.address?.state,
    zipcode: shipping?.address?.zipCode,
    country: shipping?.address?.countryId,
    phone: shipping?.phone,
  }
  const shippingMethod = shipping?.carrier?.description

  return (
    <Panel className="c-review-section">
      <Panel.Title className="c-review-section-title">
        <Panel.Title.Left>
          <h2 className="u-h5 u-text-bold u-margin-bot-none">{t('Shipping and billing information')}</h2>
        </Panel.Title.Left>
      </Panel.Title>
      <Panel.Body>
        <div className="o-grid">
          <div className="o-grid__item u-1/1 u-1/2@desktop">
            <div className="u-text-bold">{t('Shipping address')}</div>
            <Address
              address={{
                attentionLine: shippingAddress.attentionLine,
                company: shippingAddress.company,
                address1: shippingAddress.address1,
                address2: shippingAddress.address2,
                address3: shippingAddress.address3,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipcode: shippingAddress.zipcode,
                country: shippingAddress.country,
                phone: shippingAddress.phone,
              }}
            />
            <div className="u-margin-bot-small">
              <div className="u-text-bold">{t('Shipping method')}</div>
              <div>{shippingMethod}</div>
            </div>
            <div>
              <div className="u-text-bold">{t('Payment method')}</div>
              <div>
                <span>
                  {payment.type === '1' ? t('Terms') : payment.type === '2' ? t('Credit card') : t('Procurement card')}
                </span>
                <span> - </span>
                <span className={cn('icon-cards icon-cards--' + payment?.cardInfo?.type)}></span> {t('ending in')}{' '}
                {payment?.cardInfo?.maskedCardNumber && payment?.cardInfo?.maskedCardNumber.slice(-4)}
              </div>
            </div>
          </div>
          <div className="o-grid__item u-1/1 u-1/2@desktop">
            <div className="u-text-bold">{t('Billing address')}</div>
            <Address
              address={{
                attentionLine: billingAddress.attentionLine,
                company: billingAddress.company,
                address1: billingAddress.address1,
                address2: billingAddress.address2,
                address3: billingAddress.address3,
                city: billingAddress.city,
                state: billingAddress.state,
                zipcode: billingAddress.zipcode,
                country: billingAddress.country,
                phone: billingAddress.phone,
              }}
            />
            <div>
              <div className="u-text-bold">{t('Notification emails')}</div>
              <div>
                {additionalShippingNotificationEmails?.map((notificationEmail) => (
                  <div>{notificationEmail}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel.Body>
    </Panel>
  )
}

export default AddressSection

AddressSection.propTypes = {
  type: PropTypes.string.isRequired,
  address: PropTypes.shape({
    attentionLine: PropTypes.string,
    companyName: PropTypes.string,
    address1: PropTypes.string,
    address2: PropTypes.string,
    address3: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    countryId: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
}
