import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import Message from '@insight/toolkit-react/lib/Message/Message'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import { Paymetric3dsHostedIframe } from '@insight/toolkit-react/lib/Paymetric/Paymetric3dsHostedIframe'
import {
  format3DS2PhoneNumber,
  format3DS2Amount,
} from '@insight/toolkit-react/lib/Paymetric/paymetricHelpers'
import PaymetricsHostedIframe from './PaymetricsHostedIframe'
import Field from '@insight/toolkit-react/lib/Form/Field/Field'
import { fetchPM3DSFrame } from '../../../../libs/models/Payments/payment'
import msgBox from '../../../../libs/iw-components/iw-messageBox'

export function AddNewCardPM(props) {
  const storedCardDescTxt = t('Add a card description')
  const addToMyStoredCards = t('Add to my stored cards')
  const setAsMyDefault = t('Set as default')
  const requireCardInfoTxt = t('Enter new card information')

  const {
    availableCardTypes,
    canSaveCard,
    isDefaultCard,
    isPaymetricReady,
    isProcurementCard,
    locale,
    setPaymentState,
    storedCardDesc,
    addToStoredCards,
    requireCardInfo,
    isPaymentRequired,
    featureFlags,
    currencyCode,
    totalCost,
    userContact,
    billing,
    shipping,
    webRefNumber,
    isoCodes,
    isLoginAs,
    isRequisition,
    isCyberSource,
    taxIsPending,
  } = props

  function resultCallback(response) {
    props.resultCallback(response)
    setTimeout(() => {
      /**
       * set delay of enabling the place order button to to handle edge case when user clicks it before XiPay library is ready to validate iframe.
       * This delay is ok because user will take some time to enter card information
       * */
      props.setPaymentState({ isPaymetricReady: true })
    }, 1000)
  }

  useEffect(() => {
    if (isPaymentRequired) {
      //when requestor_enter_cc is on, card info is not optional and are required for payment
      props.setPaymentState({ requireCardInfo: isPaymentRequired })
    }
  }, [requireCardInfo])

  const { origin } = document.location

  const renderPaymetricIframe = () => {
    const enableCardScreening = featureFlags['GNA-9004-CS']

    if (enableCardScreening) {
      //only send 3DS2 info when user is not a requestor or loginAs, and backend enbales it with supported currency
      //note: if not a requestor or loginAs user, need to wait for tax call to finish before rendering 3DS2 iframe
      const cardinal3DSecure =
        !isRequisition && !isLoginAs && isCyberSource && !taxIsPending
          ? {
              redirectUri: `${origin}/insightweb/paymetricRedirect`,
              orderNumber: webRefNumber,
              currencyCode: isoCodes[currencyCode],
              amount: format3DS2Amount(totalCost),
              additionalFields: Object.entries({
                Email: userContact?.email,
                MobilePhone: format3DS2PhoneNumber(userContact?.phone),
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
                  value == null
                    ? newProps
                    : ((newProps[key] = value), newProps),
                {}
              ), //remove null props
            }
          : null

      const iframeConfig = {
        iFrameId: 'paymetric-iframe',
        api: fetchPM3DSFrame,
        payload: {
          hostUri: origin,
          cssUri: `${origin}/insightweb/assets/en_US/www/css/paymetric-checkout.css`,
          locale: locale,
          cvvRequired: !isRequisition && !isLoginAs && isCyberSource,
          enable3DS: !isRequisition && !isLoginAs && isCyberSource,
          cardinal3DSecure,
        },
        onInit: () => {
          props.setPaymentState({ isPaymetricReady: false })
        },
        onRender: resultCallback,
        refreshDependencies: [isProcurementCard],
        onCatch: (error, status) => {
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
        },
      }

      return (
        <>
          <Message className="c-paymetric-message" type="info">
            {t(`Enter cardholder's name exactly as it appears on the card.`)}
          </Message>
          {isRequisition || isLoginAs || !taxIsPending ? (
            <Paymetric3dsHostedIframe iframeConfig={iframeConfig} />
          ) : (
            <div className="u-text-center">
              <Loading size="large" />
            </div>
          )}
        </>
      )
    } else {
      return (
        <PaymetricsHostedIframe
          availableCardTypes={availableCardTypes}
          isProcurementCard={isProcurementCard}
          locale={locale}
          resultCallback={resultCallback}
          setPaymentState={setPaymentState}
        />
      )
    }
  }

  return (
    <div className="c-paymetric-addCard">
      {!isPaymentRequired && (
        <div className="row expanded is-collapse-child">
          <div className="columns small-12 medium-6 large-6">
            <div>
              <Field
                name="requireCardInfo"
                fieldComponent="Checkbox"
                type="checkbox"
                checked={requireCardInfo}
                checkboxLabel={requireCardInfoTxt}
                handleChange={(e) =>
                  props.setPaymentState({ requireCardInfo: e.target.checked })
                }
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      )}

      {requireCardInfo && renderPaymetricIframe()}
      {canSaveCard && requireCardInfo && isPaymetricReady && (
        <div className="row expanded is-collapse-child">
          <div className="columns small-12 medium-6 large-6">
            <div>
              <Field
                name="addToStoredCards"
                fieldComponent="Checkbox"
                type="checkbox"
                checked={addToStoredCards}
                checkboxLabel={addToMyStoredCards}
                handleChange={(e) =>
                  props.setPaymentState({ addToStoredCards: e.target.checked })
                }
                autoComplete="off"
              />
              {addToStoredCards && (
                <Field
                  fieldComponent={'Text'}
                  name={'storedCardDesc'}
                  maxlength={40}
                  placeholder={storedCardDescTxt}
                  value={storedCardDesc}
                  handleChange={(e) =>
                    props.setPaymentState({ storedCardDesc: e.target.value })
                  }
                />
              )}
            </div>
          </div>
          {addToStoredCards && (
            <div className="columns small-12 medium-6 large-6">
              <div>
                <Field
                  name="isDefaultCard"
                  fieldComponent="Checkbox"
                  type="checkbox"
                  checked={isDefaultCard}
                  checkboxLabel={setAsMyDefault}
                  handleChange={(e) =>
                    props.setPaymentState({ isDefaultCard: e.target.checked })
                  }
                  autoComplete="off"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AddNewCardPM

AddNewCardPM.propTypes = {
  canSaveCard: PropTypes.bool.isRequired,
  isDefaultCard: PropTypes.bool,
  setPaymentState: PropTypes.func.isRequired,
  storedCardDesc: PropTypes.string,
  resultCallback: PropTypes.func.isRequired,
  isPaymetricReady: PropTypes.bool.isRequired,
  featureFlags: PropTypes.bool.isRequired,
  currencyCode: PropTypes.string.isRequired,
  totalCost: PropTypes.number.isRequired,
  userContact: PropTypes.object.isRequired,
  billing: PropTypes.object.isRequired,
  shipping: PropTypes.object.isRequired,
  webRefNumber: PropTypes.number.isRequired,
  isoCodes: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  isLoginAs: PropTypes.bool.isRequired,
  isRequisition: PropTypes.bool.isRequired,
  taxIsPending: PropTypes.bool.isRequired,
  isCyberSource: PropTypes.bool.isRequired,
}
