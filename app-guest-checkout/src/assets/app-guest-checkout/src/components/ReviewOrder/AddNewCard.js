import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchPM3DSFrame } from "../../api";
import { t } from '@insight/toolkit-utils/lib/labels'
import Message from '@insight/toolkit-react/lib/Message/Message'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import { Paymetric3dsHostedIframe } from '@insight/toolkit-react/lib/Paymetric/Paymetric3dsHostedIframe'
import {
  format3DS2PhoneNumber,
  format3DS2Amount,
} from '@insight/toolkit-react/lib/Paymetric/paymetricHelpers'
import PaymetricInit from "@insight/toolkit-react/lib/Paymetric/PaymetricInit";

const AddNewCard = ({
  paymentMethod,
  webReferenceNumber,
  isoCodes,
  locale,
  currencyCode,
  totalCost,
  userContact,
  billing,
  shipping,
  payMetricCallback,
}) => {
  const { origin } = document.location
  const [pending, setPending] = useState(true)

  const isProcurementCard = paymentMethod === '3' || paymentMethod === 3
  function resultCallback(response) {
    payMetricCallback(response)
    setTimeout(() => {
      /**
       * set delay of enabling the place order button to to handle edge case when user clicks it before XiPay library is ready to validate iframe.
       * This delay is ok because user will take some time to enter card information
       * */
      setPending(false)
    }, 1000)
  }
  const renderPaymetricIframe = () => {


    //only send 3DS2 info when user is not a requestor or loginAs, and backend enbales it with supported currency
    //note: if not a requestor or loginAs user, need to wait for tax call to finish before rendering 3DS2 iframe
    // below three variables can be updated in later phases : !isRequisition && !isLoginAs

    const cardinal3DSecure = {
      redirectUri: `${origin}/insightweb/paymetricRedirect?guest=true`,
      orderNumber: webReferenceNumber,
      currencyCode: isoCodes[currencyCode],
      amount: format3DS2Amount(totalCost),
      additionalFields: Object.entries({
        Email: userContact?.email,
        MobilePhone: format3DS2PhoneNumber(userContact?.phone),
        BillingAddress1: billing?.address1,
        BillingCity: billing?.city,
        BillingState: billing?.state,
        BillingPostalCode: billing?.zipCode,
        BillingCountryCode: isoCodes[billing?.countryId],
        BillingPhone: format3DS2PhoneNumber(billing?.phone),
        ShippingAddress1: shipping?.address1,
        ShippingCity: shipping?.city,
        ShippingState: shipping?.state,
        ShippingPostalCode: shipping?.zipCode,
        ShippingCountryCode: isoCodes[shipping?.countryId],
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

    const cvvRequired = true
    const enable3DS = true

    const iframeConfig = {
      iFrameId: 'paymetric-iframe',
      api: fetchPM3DSFrame,
      payload: {
        hostUri: origin,
        cssUri: `${origin}/insightweb/assets/en_US/www/css/paymetric-checkout.css`,
        locale: locale,
        cvvRequired,
        enable3DS,
        cardinal3DSecure,
      },
      onInit: () => {
        setPending(true)
      },
      onRender: resultCallback,
      refreshDependencies: [isProcurementCard, totalCost],
      onCatch: (error, status) => {
        // need to work on page level messaging component @todo
        console.warn('An unexpected error occurred. Please contact your Account Executive for more information.')
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
        <Paymetric3dsHostedIframe iframeConfig={iframeConfig} />
      </>
    )
  }
  return <div>
    <PaymetricInit enable3DS />
    {renderPaymetricIframe()}
  </div>;
};

AddNewCard.propTypes = {
  paymentMethod: PropTypes.string,
  webReferenceNumber: PropTypes.string.isRequired,
  isoCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  locale: PropTypes.string.isRequired,
  currencyCode: PropTypes.string.isRequired,
  totalCost: PropTypes.number.isRequired,
  userContact: PropTypes.shape({
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  billing: PropTypes.shape({
    addressLine1: PropTypes.string.isRequired,
    addressLine2: PropTypes.string,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }).isRequired,
  shipping: PropTypes.shape({
    addressLine1: PropTypes.string.isRequired,
    addressLine2: PropTypes.string,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddNewCard;
