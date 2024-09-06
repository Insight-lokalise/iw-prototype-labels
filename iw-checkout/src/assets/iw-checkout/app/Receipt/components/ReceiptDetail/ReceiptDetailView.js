import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

import Currency from '@insight/toolkit-react/lib/Currency/Currency'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from '@insight/toolkit-utils/lib/labels'
import { connectToLocale } from '@insight/toolkit-react/lib/Locale/Locale'
import Address from '@insight/toolkit-react/lib/Address/Address'

import Cart from '../../../../libs/businessContainerApps/cart/cart'
import CartSummary from '../../../../libs/businessContainerApps/cartSummary/CartSummary'
import CartSummarySimple from '../../../../libs/businessContainerApps/cartSummarySimple/CartSummarySimple'
import ReviewReceiptMessageHeader from '../../../Review/components/ReviewReceiptMessageHeader/ReviewReceiptMessageHeader'
import {
  showCarrierChargeMessage,
  showShippingMethod,
} from '../../../libs/utils'
import CartPrintHeader from '../../../ShoppingCart/components/printPreview/CartPrintHeader'
import Date from '@insight/toolkit-react/lib/Date/Date'
import CartSummaryEmail from '../../../../libs/businessContainerApps/orderUtilities/CartSummaryEmailSection/CartSummaryEmail'
import CreditCardMessage from '../../../messages/CreditCardMessage'
import OrderAgain from '../OrderAgain/OrderAgain'
import QualtricsSurvey from './QualtricsSurvey'

function ContactAddressView({ contactInfo }) {
  const nameLabel = t('Name')
  const phoneLabel = t('Phone')
  const emailLabel = t('Email')
  return (
    <div className="row expanded is-collapse-child" data-private="true">
      <div className="columns small-12 medium-4">
        <label
          htmlFor="iw-checkout__order-details-contact-name"
          className="form__label--readonly"
        >
          {nameLabel}
          <p id="iw-checkout__order-details-contact-name">{contactInfo.name}</p>
        </label>
      </div>
      <div className="columns small-12 medium-4">
        <label
          htmlFor="iw-checkout__order-details-contact-phone"
          className="form__label--readonly"
        >
          {phoneLabel}
          <p id="iw-checkout__order-details-contact-phone">
            {contactInfo.phone}
          </p>
        </label>
      </div>
      <div className="columns small-12 medium-4">
        <label
          htmlFor="iw-checkout__order-details-contact-email"
          className="form__label--readonly"
        >
          {emailLabel}
          <p id="iw-checkout__order-details-contact-email">
            {contactInfo.email}
          </p>
        </label>
      </div>
    </div>
  )
}

//This is the new receipt page
export function ReceiptDetailView(props) {
  const thanksText = t('Thank you for your order')
  const thanksRequestorText = t('Thank you for your request')
  const orderInfoText = t(
    'As soon as your order is processed, you will receive an email confirmation containing your order details.'
  )
  const refNumber = t('Reference number:')
  const status = t('In process')
  const total = t('Order Total:')
  const dateOrderedText = t('Order date:')
  const additionalInfo = t('Order information')
  const shippingBillingInfo = t('Shipping and billing information')
  const shippingAddress = t('Shipping address')
  const billingAddress = t('Billing address')
  const shippingCarrier = t('Shipping carrier:')
  const shippingMethod = t('Shipping method:')
  const carrierAccount = t('Carrier account:')
  const notificationEmail = t('Notification email(s):')
  const shippingNotes = t('Shipping related notes:')
  const otherOption = t('Other option:')
  const shipComplete = t('Ship complete')
  const paymentMethod = t('Payment method')
  const poReleaseNumber = t('PO / PO release:')
  const repInfo = t('Rep information')
  const repName = t('Rep name:')
  const repEmail = t('Rep email address:')
  const repPhoneNo = t('Rep phone number:')
  const endingIn = t('ending in')
  const requestorInfo =
    'As soon as your request is processed, you will receive an email confirmation containing your request details. Your request has been submitted for approval to'

  const freightTbdMessage =
    "There has been an issue calculating shipping costs for this order. Either the freight cost is too large to calculate automatically or the address provided has returned an error. You may complete the order process, but once the order is placed you will be contacted with a quote for shipping costs before we can process the shipping. All totals are therefore showing as 'Estimated', as this price does not include shipping costs."
  const print = t('Print')

  const requestorInfoText = `${t(requestorInfo)} ${
    props.shoppingRequest.nextApprover
  }.`
  const emails = props.shipping.additionalShippingNotificationEmail
    ? props.shipping.additionalShippingNotificationEmail.split(';')
    : []
  const { orderMetaData = {} } = props.shoppingRequest
  const {
    userContact = null,
    warrantyContact = null,
    additionalOrderInformation = {},
    file = null,
  } = orderMetaData
  const {
    orderNotes = null,
    labConfigNotes = null,
    invoiceNotes = null,
  } = additionalOrderInformation
  const isIE =
    window.navigator.userAgent.includes('MSIE ') ||
    !!window.navigator.userAgent.match(/Trident.*rv\:11\./)
  const freightIsTbd = (props.carrier && props.carrier.option === 'XD') || false
  const isCES = props.context && props.context.isCES

  const renderCartSummary = () => {
    return !isCES ? (
      <CartSummary hideSaveForLater showTax useShoppingRequestShipping />
    ) : (
      <CartSummarySimple
        useShoppingRequestShipping
        hideCartOptions={props.isReceipt}
      />
    )
  }

  return (
    <div className="receipt-container">
      <div className="row expanded small-collapse large-uncollapse">
        <div className="column">
          <CartPrintHeader className="show-for-print hide-for-print-modal" />
          <section className="section">
            <div className="section__body">
              <div className="row expanded is-collapse-child">
                <div className="column">
                  <div className="row expanded">
                    <div className="columns small-12 medium-9">
                      <h1 className="shopping-cart__header-title">
                        {props.shoppingRequest.nextApprover
                          ? thanksRequestorText
                          : thanksText}
                      </h1>
                    </div>
                    <div className="columns small-12 medium-3 hide-for-print receipt-icons">
                      <div className="u-margin-bot-small">
                        <Button
                          color="link"
                          icon="print"
                          iconPosition="right"
                          onClick={() => window.print()}
                        >
                          {print}
                        </Button>
                      </div>
                      <OrderAgain />
                    </div>
                  </div>
                  <div className="row expanded">
                    <div className="columns small-12 medium-3">
                      <label
                        htmlFor="iw-checkout__order-details-web-ref-num"
                        className="form__label--readonly"
                      >
                        {refNumber}
                        <p id="iw-checkout__order-details-web-ref-num">
                          <h2 className="reference-number">
                            {props.shoppingRequest.webReferenceNumber}
                          </h2>
                        </p>
                      </label>
                    </div>
                    <div className="columns small-6 medium-2">
                      <label
                        htmlFor="iw-checkout__order-details-display-date"
                        className="form__label--readonly"
                      >
                        {dateOrderedText}
                        <p id="iw-checkout__order-details-display-date">
                          <Date date={props.shoppingRequest.orderDate} />
                        </p>
                      </label>
                    </div>
                    {!props.isStockAndPriceDisplayDisabled && (
                      <div className="columns small-12 medium-2">
                        <label
                          htmlFor="iw-checkout__order-details-total-cost"
                          className="form__label--readonly"
                        >
                          {total}
                          <p id="iw-checkout__order-details-total-cost">
                            <Currency
                              currencyCode={
                                props.shoppingRequest.soldTo.currency
                              }
                              value={props.cart.summary.totalCost}
                            />
                          </p>
                        </label>
                      </div>
                    )}
                    {(props.payment.poNumber ||
                      props.payment.poReleaseNumber) && (
                      <div className="columns small-12 medium-3">
                        <label
                          htmlFor="iw-checkout__order-details-po-number"
                          className="form__label--readonly"
                        >
                          {poReleaseNumber}
                          <p id="iw-checkout__order-details-po-number">
                            {props.payment.poNumber}
                            {props.payment.poNumber &&
                              props.payment.poReleaseNumber &&
                              ' / '}
                            {props.payment.poReleaseNumber}
                          </p>
                        </label>
                      </div>
                    )}
                  </div>
                  <p>
                    {props.shoppingRequest.nextApprover
                      ? requestorInfoText
                      : orderInfoText}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <ReviewReceiptMessageHeader isReceipt={props.isReceipt} />
        </div>
      </div>
      <div className="row expanded small-collapse large-uncollapse">
        <div
          className={
            'columns print-cart-container small-12  print-12 ' +
            cn({
              'large-9': !props.isStockAndPriceDisplayDisabled,
              'large-12': props.isStockAndPriceDisplayDisabled,
            })
          }
        >
          <section>
            <section className="section">
              <div className="row expanded section__header is-collapse-child align-middle align-justify">
                <h3 className="columns shrink section__header-title">
                  {shippingBillingInfo}
                </h3>
              </div>
              <div className="section__body">
                <div className="row expanded is-collapse-child">
                  <div className="o-grid review-page-shipping-address-section">
                    <div className="o-grid__item u-1/2">
                      <label
                        htmlFor="iw-checkout__order-details-company-name"
                        className="form__label--readonly"
                      >
                        {shippingAddress}
                        <Address
                          address={{
                            attentionLine: props.shipping.attentionLine,
                            company: props.shipping.companyName,
                            address1: props.shipping.address.address1,
                            address2: props.shipping.address.address2,
                            address3: props.shipping.address.address3,
                            city: props.shipping.address.city,
                            state: props.shipping.address.state,
                            zipcode: props.shipping.address.zipCode,
                            country: props.shipping.address.countryId,
                            phone: props.shipping.phone,
                          }}
                        />
                      </label>
                    </div>
                    {props?.shipping?.address?.dunsNumber && (
                      <div className="o-grid__item u-1/2">
                        <div className="u-text-bold">{t('Duns Number')}</div>
                        <div>{props?.shipping?.address?.dunsNumber}</div>
                      </div>
                    )}
                  </div>
                  <div className="columns small-12 medium-6">
                    <label
                      htmlFor="iw-checkout__order-details-company-name"
                      className="form__label--readonly"
                    >
                      {billingAddress}
                      <Address
                        address={{
                          attentionLine: props.billing.attentionLine,
                          company: props.billing.companyName,
                          address1: props.billing.address.address1,
                          address2: props.billing.address.address2,
                          address3: props.billing.address.address3,
                          city: props.billing.address.city,
                          state: props.billing.address.state,
                          zipcode: props.billing.address.zipCode,
                          country: props.billing.address.countryId,
                          phone: props.billing.phone,
                        }}
                      />
                    </label>
                  </div>
                </div>
                {props.cartHasShippableItems && (
                  <div className="row expanded is-collapse-child">
                    <div className="columns small-12 medium-6">
                      <label
                        htmlFor="iw-checkout__order-details-shipping-carrier"
                        className="form__label--readonly"
                      >
                        {isCES ? shippingMethod : shippingCarrier}
                        <p id="iw-checkout__order-details-shipping-carrier">
                          {showShippingMethod({
                            name: props.carrier.name,
                            description: props.carrier.description,
                            isCES,
                            isEMEA: props.isEMEA,
                            freightIsTbd,
                          })}
                        </p>
                      </label>
                    </div>
                    {props.canShowThirdPartyCarrier &&
                      props.carrier.thirdPartyDisplayName && (
                        <div className="columns small-12 medium-6">
                          <label
                            htmlFor="iw-checkout__order-details-third-party"
                            className="form__label--readonly"
                          >
                            {carrierAccount}
                            <p id="iw-checkout__order-details-third-party">
                              {props.carrier.thirdPartyDisplayName}
                            </p>
                          </label>
                        </div>
                      )}
                    {props.shipping.shipComplete && (
                      <div className="columns small-12 medium-6">
                        <label
                          htmlFor="iw-checkout__order-details-ship-complete"
                          className="form__label--readonly"
                        >
                          {otherOption}
                          <p id="iw-checkout__order-details-ship-complete">
                            {shipComplete}
                          </p>
                        </label>
                      </div>
                    )}
                    {emails.length > 0 && (
                      <div className="columns small-12 medium-6">
                        <label
                          htmlFor="iw-checkout__order-details-notification-email"
                          className="form__label--readonly"
                        >
                          {notificationEmail}
                          <p
                            id="iw-checkout__order-details-notification-email"
                            data-private="true"
                          >
                            {emails.map((email, index) =>
                              index < emails.length - 1 ? (
                                <>
                                  <span key={email}>{`${email},`}</span>
                                  <br />
                                </>
                              ) : (
                                <span key={email}>{email}</span>
                              )
                            )}
                          </p>
                        </label>
                      </div>
                    )}
                    {props.shipping.notes && (
                      <div className="columns small-12 medium-6">
                        <label
                          htmlFor="iw-checkout__order-details-shipping-notes"
                          className="form__label--readonly"
                        >
                          {shippingNotes}
                          <p id="iw-checkout__order-details-shipping-notes">
                            {props.shipping.notes}
                          </p>
                        </label>
                      </div>
                    )}
                  </div>
                )}
                <div className="row expanded is-collapse-child">
                  <div className="columns small-12 medium-6">
                    <label
                      htmlFor="iw-checkout__order-details-payment-card-info"
                      className="form__label--readonly"
                    >
                      {paymentMethod}
                      <p
                        id="iw-checkout__order-details-payment-card-info"
                        data-private="true"
                      >
                        <span>
                          {props.payment.type === '1'
                            ? t('Terms')
                            : props.payment.type === '2'
                            ? t('Credit card')
                            : t('Procurement card')}
                        </span>
                        {props.payment.type != '1' &&
                          props.payment.cardInfo &&
                          (!props.isEMEA ||
                            (props.isEMEA &&
                              props.payment.cardInfo.id != 0)) && (
                            <>
                              <span> - </span>
                              <span
                                className={cn(
                                  'hide-for-print icon-cards icon-cards--' +
                                    props.payment.cardInfo.type
                                )}
                              >
                                <span className="show-for-sr">
                                  {props.payment.cardInfo.type}
                                </span>
                              </span>
                              <span className="show-for-print print-inline">
                                <strong>{props.payment.cardInfo.type}</strong>
                              </span>{' '}
                              {endingIn}{' '}
                              {props.payment.cardInfo.maskedCardNumber &&
                                props.payment.cardInfo.maskedCardNumber.slice(
                                  -4
                                )}
                            </>
                          )}
                      </p>
                    </label>
                  </div>
                  {props.payment.type === '3' &&
                    props.payment.procurementFields &&
                    props.payment.procurementFields.length > 0 && (
                      <div className="columns small-12 medium-6">
                        <label
                          htmlFor="iw-checkout__paymentsfc-reporting"
                          className="form__label--readonly"
                        >
                          {t('Reporting fields:')}
                          <p id="iw-checkout__paymentsfc-reporting">
                            {props.payment.procurementFields.join(', ')}
                          </p>
                        </label>
                      </div>
                    )}
                </div>
                <div className="row expanded is-collapse-child">
                  {props.transportsToDetermine && (
                    <div className="columns small-12 medium-12 message">
                      {showCarrierChargeMessage()}
                    </div>
                  )}
                  {freightIsTbd && (
                    <div className="columns small-12 medium-12 message">
                      {freightTbdMessage}
                    </div>
                  )}
                  <CreditCardMessage />
                </div>
              </div>
            </section>
            {Object.keys(orderMetaData).length > 0 &&
              props.hasAdditionalOrderInformation && (
                <section className="section">
                  <div className="row expanded section__header is-collapse-child align-middle align-justify">
                    <h3 className="columns shrink section__header-title">
                      {additionalInfo}
                    </h3>
                  </div>
                  <div className="section__body" data-private="true">
                    <div className="row expanded is-collapse-child">
                      {props.smartTracker.map((smartTracker, index) => {
                        const isNavySmarttracker =
                          props.isNavy && props.navySTName === smartTracker.name
                        return (
                          <div
                            key={index}
                            className={cn(
                              { hide: isNavySmarttracker },
                              'columns small-12 medium-6 large-4'
                            )}
                          >
                            <label
                              htmlFor="iw-checkout__order-details-smart-tracker-name"
                              className="form__label--readonly"
                            >
                              {smartTracker.name}
                              <p id="iw-checkout__order-details-smart-tracker-name">
                                {smartTracker.value}
                              </p>
                            </label>
                          </div>
                        )
                      })}
                    </div>
                    {((props.hasSharedUserFields && !isCES) ||
                      props.isSimplifiedCESUser) &&
                      userContact && (
                        <ContactAddressView contactInfo={userContact} />
                      )}
                    {props.hasWarrantyFields && warrantyContact && (
                      <ContactAddressView contactInfo={warrantyContact} />
                    )}
                    <div className="row expanded is-collapse-child">
                      {props.hasAdditionalOrderNotes && (
                        <div className="columns small-12 medium-4">
                          <label
                            htmlFor="iw-checkout__order-details-additional-notes"
                            className="form__label--readonly"
                          >
                            {t('Additional order notes')}
                            {orderNotes && (
                              <p id="iw-checkout__order-details-additional-notes">
                                {orderNotes}
                              </p>
                            )}
                          </label>
                        </div>
                      )}
                      {props.hasLabConfigurationNotes && (
                        <div className="columns small-12 medium-4">
                          <label
                            htmlFor="iw-checkout__order-details-lab-config"
                            className="form__label--readonly"
                          >
                            {t('Lab config notes')}
                            {labConfigNotes && (
                              <p id="iw-checkout__order-details-lab-config">
                                {labConfigNotes}
                              </p>
                            )}
                          </label>
                        </div>
                      )}
                      {props.hasInvoiceNotes && (
                        <div className="columns small-12 medium-4">
                          <label
                            htmlFor="iw-checkout__order-details-invoice-notes"
                            className="form__label--readonly"
                          >
                            {t('Invoice notes')}
                            {invoiceNotes && (
                              <p id="iw-checkout__order-details-invoice-notes">
                                {invoiceNotes}
                              </p>
                            )}
                          </label>
                        </div>
                      )}
                      {props.hasFileUpload && (
                        <div className="columns small-12 medium-4">
                          <label
                            htmlFor="iw-checkout__order-details-file-label"
                            className="form__label--readonly"
                          >
                            {t('File')}
                            {file && (
                              <p id="iw-checkout__order-details-file-label">
                                {file.displayName || ''}
                              </p>
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
            {props.shoppingRequest.repInfo && (
              <section className="section">
                <div className="row expanded section__header is-collapse-child align-middle align-justify">
                  <h3 className="columns shrink section__header-title">
                    {repInfo}
                  </h3>
                </div>
                <div className="section__body" data-private="true">
                  <div className="row expanded is-collapse-child">
                    <div className="columns small-12 medium-4">
                      <label
                        htmlFor="iw-checkout__order-details-rep-name"
                        className="form__label--readonly"
                      >
                        {repName}
                        <p id="iw-checkout__order-details-rep-name">
                          {props.shoppingRequest.repInfo.name}
                        </p>
                      </label>
                    </div>
                    <div className="columns small-12 medium-4">
                      <label
                        htmlFor="iw-checkout__order-details-rep-phone"
                        className="form__label--readonly"
                      >
                        {repPhoneNo}
                        <p id="iw-checkout__order-details-rep-phone">
                          {props.shoppingRequest.repInfo.phone}
                        </p>
                      </label>
                    </div>
                    <div className="columns small-12 medium-4">
                      <label
                        htmlFor="iw-checkout__order-details-rep-email"
                        className="form__label--readonly"
                      >
                        {repEmail}
                        <p id="iw-checkout__order-details-rep-email">
                          {props.shoppingRequest.repInfo.email}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            )}
            <Cart
              isReadOnly
              showReadOnlyLineLevels
              showReadOnlyDEPSection
              disableLineLevelLink
              disableDEPLink
            />
            {isIE && (
              <div className="hide print-show columns small-12 large-3 print-5 print-offset-7">
                {renderCartSummary()}
              </div>
            )}
          </section>
        </div>
        {!props.isStockAndPriceDisplayDisabled && (
          <div
            className={
              'columns small-12 large-3 ' +
              cn({
                'hide-for-print': isIE,
                'print-5': !isIE,
                'print-offset-7': !isIE,
              })
            }
          >
            <div>{renderCartSummary()}</div>
          </div>
        )}
      </div>
      <CartSummaryEmail showTax useShoppingRequestShipping />
      <QualtricsSurvey />
    </div>
  )
}

export default connectToLocale(ReceiptDetailView)

ReceiptDetailView.propTypes = {
  shipping: PropTypes.object.isRequired,
  carrier: PropTypes.object,
  billing: PropTypes.object.isRequired,
  isReceipt: PropTypes.bool.isRequired,
  isStockAndPriceDisplayDisabled: PropTypes.bool,
  smartTracker: PropTypes.array.isRequired,
  payment: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  shoppingRequest: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  hasPOFields: PropTypes.bool,
  transportsToDetermine: PropTypes.bool,
  isEMEA: PropTypes.bool,
}
