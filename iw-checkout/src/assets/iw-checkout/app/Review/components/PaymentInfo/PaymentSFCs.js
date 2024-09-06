import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  format3DS2PhoneNumber,
  format3DS2Amount,
} from '@insight/toolkit-react/lib/Paymetric/paymetricHelpers'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from './../../../../libs/iw-components'
import { IWTextField } from '../../../../libs/iw-components/iw-form'
import { fetchPM3DSSaved } from '../../../../libs/models/Payments/payment'
import {
  checkExpired,
  transformCardInfoToStoredCard,
} from './paymentInfoHelpers'
import CreditCardMessage from '../../../messages/CreditCardMessage'
import msgBox from '../../../../libs/iw-components/iw-messageBox'

export function PaymentInfoReadOnlyView(props) {
  const {
    type,
    cardInfo = null,
    poNumber = null,
    poReleaseNumber = null,
    procurementFields = [],
  } = props.selectedPayment

  return (
    <div>
      {type !== '1' ? (
        cardInfo && [
          <SelectedPaymentCardView
            selectedCard={transformCardInfoToStoredCard(cardInfo)}
          />,
          <CreditCardMessage />,
        ]
      ) : (
        <div className="row expanded is-collapse-child">
          <div className="columns small-6">
            <label
              htmlFor="iw-checkout__paymentsfc-terms"
              className="form__label--readonly"
            >
              {t('Payment type:')}
              <p id="iw-checkout__paymentsfc-terms">{t('Terms')}</p>
            </label>
          </div>
        </div>
      )}
      {procurementFields.length > 0 && (
        <div className="row expanded is-collapse-child">
          <div className="columns small-12">
            <label
              htmlFor="iw-checkout__paymentsfc-reporting"
              className="form__label--readonly"
            >
              {t('Reporting fields:')}
              <p id="iw-checkout__paymentsfc-reporting">
                {procurementFields.join(', ')}
              </p>
            </label>
          </div>
        </div>
      )}
      {props.hasPOFields && (
        <div className="row expanded is-collapse-child">
          <div className="columns small-6">
            <label
              htmlFor="iw-checkout__paymentsfc-po-number"
              className="form__label--readonly"
            >
              {t('P.O. number:')}
              <p id="iw-checkout__paymentsfc-po-number">{poNumber}</p>
            </label>
          </div>
          {!props.isSupressPOReleaseNumber && (
            <div className="columns small-6">
              <label
                htmlFor="iw-checkout__paymentsfc-po-release-num"
                className="form__label--readonly"
              >
                {t('P.O. release number:')}
                <p id="iw-checkout__paymentsfc-po-release-num">
                  {poReleaseNumber}
                </p>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
PaymentInfoReadOnlyView.propTypes = {
  selectedPayment: PropTypes.object.isRequired,
  hasPOFields: PropTypes.bool,
  isSupressPOReleaseNumber: PropTypes.bool,
}

export function SelectedPaymentCardView(props) {
  const {
    selectedCard: {
      displayCardNum,
      storedCardType,
      storedCardHolderName,
      storedCardExpMonth,
      storedCardExpYear,
      storedCardToken,
      storedCardId,
    },
    currencyCode,
    billing,
    shipping,
    userContact,
    webRefNumber,
    locale,
    isoCodes,
    totalCost,
    resultCallback,
    isRequisition,
    isCyberSource,
    isLoginAs,
    setPaymentState,
    featureFlags,
    taxIsPending,
  } = props

  let cardEndingIn = displayCardNum && displayCardNum.slice(-4)
  if (!displayCardNum) {
    cardEndingIn = storedCardToken && storedCardToken.slice(-4)
  }
  const expiryDate = t('Expiration date')
  const nameOnCard = t('Name on card')
  const isExpired = checkExpired(storedCardExpMonth, storedCardExpYear)

  const enableCardScreening = featureFlags['GNA-9004-CS']

  useEffect(() => {
    // when using a saved card, access token is only needed when it is not a requestor or loginAs user,
    // and backend enables it with supported currency
    if (
      enableCardScreening &&
      !taxIsPending &&
      !isExpired &&
      !isRequisition &&
      !isLoginAs &&
      isCyberSource
    ) {
      setPaymentState({ isPaymetricReady: false })

      const cardinal3DSecure = {
        redirectUri: `${origin}/insightweb/paymetricRedirect`,
        orderNumber: webRefNumber,
        currencyCode: isoCodes[currencyCode],
        amount: format3DS2Amount(totalCost),
        additionalFields: Object.entries({
          Email: userContact?.email,
          MobilePhone: format3DS2PhoneNumber(userContact?.phone),
          BillingFullName: storedCardHolderName,
          BillingAddress1: billing?.address?.address1,
          BillingCity: billing?.address?.city,
          BillingState: billing?.address?.state,
          BillingPostalCode: billing?.address?.zipCode,
          BillingCountryCode: isoCodes[billing?.address?.countryId],
          BillingPhone: format3DS2PhoneNumber(billing?.phone),
          ShippingAddress1: shipping?.address?.address1,
          ShippingCity: shipping?.address?.city,
          ShippingState: shipping?.address?.state,
          ShippingPostalCode: shipping?.address?.zipCode,
          ShippingCountryCode: isoCodes[shipping?.address?.countryId],
          ShippingPhone: format3DS2PhoneNumber(shipping?.phone),
          /**
           * Browser additional fields:
           * note: BrowserHeader and IPAddress will be added on the server side
           * since they are only available in the http request object
           */
          BrowserJavaEnabled: window.navigator.javaEnabled
            ? window.navigator.javaEnabled()
            : false, //modern browsers do not support Java
          BrowserLanguage: window.navigator.language,
          BrowserColorDepth: window.screen.colorDepth,
          BrowserScreenHeight: window.screen.height,
          BrowserScreenWidth: window.screen.width,
          BrowserTimeZone: new Date().getTimezoneOffset(),
          BrowserJavascriptEnabled: false,
          UserAgent: window.navigator.userAgent,
          DeviceChannel: 'Browser',
        }).reduce(
          (newProps, [key, value]) =>
            value == null ? newProps : ((newProps[key] = value), newProps),
          {}
        ), //remove null props
      }
      //storedCardToken != displayCardNum, send the actual token with expiration date,
      //storedCardToken == displayCardNum, we don't have the actual token yet since user has selected a different stored card.  Backend will use storedCardId to get the actual token.
      if (storedCardToken != displayCardNum) {
        cardinal3DSecure.xiSecureToken = storedCardToken
        cardinal3DSecure.expMonth = String(storedCardExpMonth)
        cardinal3DSecure.expYear = String(storedCardExpYear)
      }

      fetchPM3DSSaved(storedCardId, {
        locale: locale,
        cvvRequired: true,
        enable3DS: true,
        cardinal3DSecure,
      })
        .then((data) => {
          if (data.accessToken && data.merchantGuid) {
            resultCallback(data)
            setTimeout(() => {
              /**
               * set delay of enabling the place order button to to handle edge case when user clicks it before XiPay library is ready to validate iframe.
               * This delay is ok because user will take some time to enter card information
               * */
              props.setPaymentState({ isPaymetricReady: true })
            }, 1000)
          }
        })
        .catch((error, status) => {
          msgBox.addMsg('shopping-cart', {
            text: t(
              'An unexpected error occurred. Please contact your Account Executive for more information.'
            ),
            severity: 'error',
            scrollTo: '.SBP__messages',
          })
          if (status === 401) {
            window.location.href = '/login'
          }
        })
    }
  }, [storedCardId, isExpired, taxIsPending])

  return (
    <div>
      <div className="row expanded is-collapse-child">
        <div className="columns small-12 medium-3">
          <label
            htmlFor="iw-checkout__paymentsfc-stored-card-type"
            className="form__label--readonly"
          >
            {t('Card:')}
            <p id="iw-checkout__paymentsfc-stored-card-type">
              <span
                className={`hide-for-print icon-cards icon-cards--${storedCardType}`}
              >
                <span className="show-for-sr">{storedCardType}</span>
              </span>
              <span className="show-for-print print-inline">
                <strong>{storedCardType}</strong>
              </span>
              {` ${t('ending in')} ${cardEndingIn}`}
            </p>
          </label>
        </div>
        <div className="columns small-4 medium-3">
          <label
            htmlFor="iw-checkout__paymentsfc-card-holder-name"
            className="form__label--readonly"
          >
            {`${nameOnCard}:`}
            <p id="iw-checkout__paymentsfc-card-holder-name">
              {storedCardHolderName}
            </p>
          </label>
        </div>
        <div className="columns small-4 medium-3">
          <label
            htmlFor="iw-checkout__paymentsfc-expired"
            className="form__label--readonly"
          >
            {`${expiryDate}:`}
            {isExpired ? (
              <p id="iw-checkout__paymentsfc-expired" className="color--red">
                {t('Expired')}
              </p>
            ) : (
              <p>
                {storedCardExpMonth < 10
                  ? `0${storedCardExpMonth}`
                  : storedCardExpMonth}{' '}
                / {storedCardExpYear}
              </p>
            )}
          </label>
        </div>
        {enableCardScreening &&
          !isRequisition &&
          !isLoginAs &&
          isCyberSource &&
          !isExpired && (
            <div className="columns small-4 medium-3">
              <IWTextField
                label={t('CVV')}
                name="cvvNumber"
                maxLength={4}
                required={true}
                className="c-paymetric-cvv"
                errorMessage={t('Security code is required.')}
              />
            </div>
          )}
        {isExpired && (
          <div className="columns small-12 medium-3 align-self-middle">
            <a
              className="button hollow small"
              onClick={props.onUpdateExpiredCard}
            >
              {t('Update card')}
            </a>
          </div>
        )}
      </div>
      {isExpired && (
        <div className="row expanded is-collapse-child">
          <div className="column">
            <p className="form__field-msg form__field-msg--error">
              {t(
                '* The card has expired. Please edit or delete the information.'
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
SelectedPaymentCardView.propTypes = {
  selectedCard: PropTypes.object.isRequired,
  onUpdateExpiredCard: PropTypes.func,
  billing: PropTypes.object.isRequired,
  shipping: PropTypes.object.isRequired,
  userContact: PropTypes.object.isRequired,
  resultCallback: PropTypes.func.isRequired,
  currencyCode: PropTypes.string.isRequired,
  totalCost: PropTypes.number.isRequired,
  webRefNumber: PropTypes.number.isRequired,
  isoCodes: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  isRequisition: PropTypes.bool.isRequired,
  isCyberSource: PropTypes.bool.isRequired,
  isLoginAs: PropTypes.bool.isRequired,
  setPaymentState: PropTypes.func.isRequired,
  featureFlags: PropTypes.object.isRequired,
  taxIsPending: PropTypes.bool.isRequired,
}

export function StoredCardsLink(props) {
  return (
    <IWAnchor className="section__body-action" onClick={props.onClick}>
      {t('Stored cards')}
    </IWAnchor>
  )
}

export function AddNewCard(props) {
  const isRequired = props.isPaymentRequired
  const cardNumber = t('Card number')
  const nameOnCard = t('Name on card')
  const storedCardDesc = t('Add a card description')
  const addToMyStoredCards = t('Add to my stored cards')
  const setAsMyDefault = t('Set as default')
  const expiryDate = t('Expiration date')
  const expiryMonth = t('Month')
  const expiryYear = t('Year')
  return (
    <FormSection name="cardInfo">
      <div className="row expanded is-collapse-child">
        <div className="columns small-12 medium-6 large-4">
          <IWTextField
            label={cardNumber}
            name="storedCardToken"
            required={isRequired}
            maxLength={19}
            size={19}
            validate={[
              (value, allValues) =>
                requiredFieldValidation(
                  value,
                  allValues,
                  isRequired,
                  cardNumber
                ),
              (value) => checkValidCardNumber(value),
              (value) => checkValidCardType(value, props.availableCardTypes),
            ]}
          />
        </div>
        <div className="columns small-12 medium-6 large-4">
          <IWTextField
            label={nameOnCard}
            name="storedCardHolderName"
            required={isRequired}
            validate={(value, allValues) =>
              requiredFieldValidation(value, allValues, isRequired, nameOnCard)
            }
          />
        </div>
        <div className="columns small-12 medium-6 large-4">
          <fieldset>
            <legend className="form__legend">
              <p className="form__label">
                {expiryDate}
                {isRequired && <span className="form__required">*</span>}
              </p>
            </legend>
            <div className="row row__gutter--tiny collapse">
              <div className="columns">
                <IWSelectField
                  className="form__field"
                  placeholder={expiryMonth}
                  optionsArrayOrFunction={allowedMonths}
                  label={expiryMonth}
                  hideLabel
                  name="storedCardExpMonth"
                  validate={[
                    (value, allValues) =>
                      requiredFieldValidation(
                        value,
                        allValues,
                        isRequired,
                        expiryMonth,
                        true
                      ),
                    checkValidExpiryDate,
                  ]}
                />
              </div>
              <div className="columns">
                <IWSelectField
                  className="form__field"
                  placeholder={expiryYear}
                  optionsArrayOrFunction={allowedYears()}
                  label={expiryYear}
                  hideLabel
                  name="storedCardExpYear"
                  validate={(value, allValues) =>
                    requiredFieldValidation(
                      value,
                      allValues,
                      isRequired,
                      expiryYear,
                      true
                    )
                  }
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      {props.canSaveCard && (
        <div className="row expanded is-collapse-child">
          <div className="columns small-12 medium-6 large-4">
            <IWCheckboxField
              className="form__label--inline"
              name="addToStoredCards"
              label={addToMyStoredCards}
              showChildIfChecked
            >
              <IWTextField
                className="form__field"
                name="storedCardDesc"
                label={storedCardDesc}
                placeholder={storedCardDesc}
                required={isRequired}
                validate={(value, allValues) =>
                  requiredFieldValidation(
                    value,
                    allValues,
                    isRequired,
                    storedCardDesc
                  )
                }
                maxLength="40"
                hideLabel
              />
            </IWCheckboxField>
          </div>
          {props.isAddToStoredCardsSelected && (
            <div className="columns small-12 medium-6 large-4">
              <IWCheckboxField
                className="form__label--inline"
                name="isDefaultCard"
                label={setAsMyDefault}
              />
            </div>
          )}
        </div>
      )}
    </FormSection>
  )
}

AddNewCard.defaultProps = {
  canSaveCard: true,
}
