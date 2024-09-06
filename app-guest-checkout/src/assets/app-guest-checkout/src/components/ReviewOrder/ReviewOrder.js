import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import PaymentSection from './PaymentSection';
import { Summary } from '@insight/toolkit-react'
import { getPersistCheckoutFromStorage, t, checkoutGAE } from "@insight/toolkit-utils";
import { setStorage } from "@insight/toolkit-utils/lib/helpers/storageHelpers";
import { paymetric3DS2SubmitIframe } from '@insight/toolkit-react/lib/Paymetric/paymetricHelpers'
import { connectToLocale } from "@insight/toolkit-react/lib/Locale/Locale";
import {
  selector_hasShippableItems,
  selector_shoppingRequest,
  selector_soldTo,
  selector_cart,
  selector_cartItemsGAE
} from "../../state/slices/selectors/ShoppingReqeustSelector";
import AddressSection from "./AddressSection";
import PlaceOrderButton from "./PlaceOrderButton";
import { GUEST_PAYMENT_METHODS, PAGE_ROUTE, ROUTES } from "../../constants";
import ShippingOptionsView from "./ShippingOptionsView";
import CustomerOrderInfoView from "./CustomerOrderInfoView";
import { selector_lineLevelSessionInfos } from "../../state/slices/selectors/lineLevelSessionInfosSelector";
import CartView from "./CartView";
import { fetchIsoCodes, fetchWebRefNumber, validateShoppingRequest, fetchTaxAndEWRFee } from "../../api";
import { getProp65Compliance } from "../../api/getProp65Compliance";
import { storePaymentInfoForCardScreening } from "../../lib/Helpers";
import { addMessage, clearAllMessages } from './../../state/slices/messageSlice'
import PaymetricChallengeIframe from "@insight/toolkit-react/lib/Paymetric/PaymetricChallengeIframe";
import { save as saveShoppingRequest } from "../../state/slices/shoppingRequestSlice";
import { Message } from '@insight/toolkit-react'
import { save as saveLineLevelSessionInfos } from './../../state/slices/lineLevelSessionInfosSlice'

const paymentInitialState = {
  webReferenceNumber: null,
  isoCodes: null,
  paymentMethod: 2,
  pending: false,
  loading: true,
  error: null,
  showChallenge: false,
  challengeEvent: null,
  challengeWindowSize: '05',
};

const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_WEB_REFERENCE_NUMBER':
      return { ...state, webReferenceNumber: action.payload };
    case 'SET_ISO_CODES':
      return { ...state, isoCodes: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'SET_PENDING':
      return { ...state, pending: action.payload };
    case 'SET_CHALLENGE':
      return { ...state, showChallenge: action.payload.showChallenge, challengeEvent: action.payload.challengeEvent };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const ReviewOrder = (props) => {
  const { context } = props
  const { currencyCode } = context
  const [paymentState, paymentDispatch] = useReducer(paymentReducer, paymentInitialState);
  const payMetricRef = useRef(null)
  const paymentInsightFormRef = useRef(null)
  const cartData = useSelector(cartData => selector_cart(cartData))
  const cartItemsGAE = useSelector(cartItems => selector_cartItemsGAE(cartItems))
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const hasShippableItems = useSelector(selector_hasShippableItems)
  const soldTo = useSelector(selector_soldTo)
  const { cart, shipping = {}, billing = {}, orderMetaData } = shoppingRequest
  const { address = {}, carrier, attentionLine = '', companyName = '', additionalShippingNotificationEmail } = shipping
  const shippingMethod = carrier?.description || ''
  const billingAddress = billing?.address || {}
  const billingAttentionLine = billing?.attentionLine || ''
  const billingCompanyName = billing?.companyName || ''
  const billingPhone = billing?.phone || ''
  const shippingPhone = shipping?.phone || ''
  const history = useHistory()
  const dispatch = useDispatch()
  const paymetricErrorMessage = t('An unexpected error occurred. Please contact your Account Executive for more information.')
  const cartValidationErrorMessage = t('An error occurred during checkout. The total has been updated. Please review and please your order again.')
  const [prop65ComplianceData, setProp65Compliance] = useState([])

  useEffect(() => {
    const fetchTaxAndEWRFeeForTheCartItems = async (shoppingRequest) => {
      try {
        const { data } = await fetchTaxAndEWRFee(shoppingRequest)
        data && dispatch(saveShoppingRequest(data))
      } catch (error) {
        console.error(error)
      }
    }
    fetchTaxAndEWRFeeForTheCartItems(shoppingRequest)
    setStorage('quickCheckoutRequested', true)
  }, [])

  useEffect(() => {
    checkoutGAE({
      step: 4,
      cart: cart.summary,
      cartItems: cartItemsGAE,
      isSaveAsQuote: false,
      isOrderTemplate: false,
      isQuickCheckout: false,
      overridePageTitle: ROUTES['REVIEW'].name
    });
    const fetchData = async () => {
      try {
        const [webRefResponse, isoCodesResponse] = await Promise.all([
          fetchWebRefNumber(shoppingRequest),
          fetchIsoCodes({
            countryCodes: [
              billingAddress?.countryId,
              address?.countryId,
            ],
            currencyCodes: [soldTo?.currency || currencyCode],
          }),
          getProp65Compliance(shoppingRequest).then((data) => {
            setProp65Compliance(data.data || null);
          })
        ]);

        paymentDispatch({ type: 'SET_WEB_REFERENCE_NUMBER', payload: webRefResponse.data });
        paymentDispatch({ type: 'SET_ISO_CODES', payload: isoCodesResponse.data });
      } catch (error) {
        paymentDispatch({ type: 'SET_ERROR', payload: error });
      } finally {
        paymentDispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
    if (paymentState.showChallenge) {
      checkoutGAE({
        step: 4.5,
        cart: cart.summary,
        cartItems: cartItemsGAE,
        isSaveAsQuote: false,
        isOrderTemplate: false,
        isQuickCheckout: false,
        overridePageTitle: ROUTES['REVIEW'].name
      });
    }
  }, [paymentState.showChallenge]);

  const handleAddMessage = (messageText, type) => {
    dispatch(addMessage({ text: messageText, type }));
  };

  const handleClearMessages = (messageText, type) => {
    dispatch(clearAllMessages());
  };

  const onPaymentMethodChange = value => paymentDispatch({ type: 'SET_PAYMENT_METHOD', payload: parseInt(value) })
  const onPendingChange = pending => paymentDispatch({ type: 'SET_PENDING', payload: pending })
  const setLoading = loading => paymentDispatch({ type: 'SET_LOADING', payload: loading })
  const challenge3DS2Handler = challengeEvent => paymentDispatch({
    type: 'SET_CHALLENGE',
    payload: { showChallenge: true, challengeEvent }
  })

  const onShipBillEdit = (type) => {
    scrollTo(0, 0)
    history.push({ pathname: ROUTES.SHOPPING_INFO.url + "#" + type })
  }

  const orderHasSellRequirements = () => {
    const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
    return lineLevelSessionInfos.find((llsInfo) => (llsInfo.sellRequirements != null
      && llsInfo.sellRequirements.length > 0)) != null;
  }

  const payMetricCallback = (responseData) => {
    payMetricRef.current = responseData
  }

  const handlePlaceOrderButton = async () => {
    // Place order button invoked from summary
    // remotely invoke form submit
    handleClearMessages()
    const isValidShoppingRequest = await handleShoppingRequestValidation()
    if (isValidShoppingRequest) {
      paymentInsightFormRef.current && paymentInsightFormRef.current.click();
    }
  }

  const handleShoppingRequestValidation = async () => {
    try {
      onPendingChange(true);
      const validatedSR = await validateShoppingRequestForPrices();
      if (Object.keys(validatedSR).length !== 0) {
        // update redux store with new shopping request
        dispatch(saveShoppingRequest(validatedSR.shoppingRequest))
        dispatch(
          saveLineLevelSessionInfos(validatedSR.lineLevelSessionInfos)
        )
        // updatedShoppingRequest.current = {...validatedSR.shoppingRequest};
        if (validatedSR?.validShoppingRequest) {
          handleClearMessages();
          return true;
        } else {
          handleAddMessage(cartValidationErrorMessage, 'error');
          return false;
        }
      }
      return false;
    } catch (e) {
      console.warn(e);
    } finally {
      onPendingChange(false);
    }
  }

  const saveAdditionalPaymentFields = (values) => {
    // prepare payment request for storing into shopping request
    // Submit additional fields form
    const { poNumber = '', poReleaseNumber = '', paymentMethod, ...rest } = values
    const procurementFields = Object.entries(rest).reduce((acc, curr) => {
      acc[curr[0].at(-1)] = curr[1]
      return acc
    }, [])
    const billingRequest = {
      type: values.paymentMethod,
      option: GUEST_PAYMENT_METHODS.find(i => i.paymentMethodId === values.paymentMethod).paymentOptionTerms,
      poNumber,
      poReleaseNumber,
      procurementFields
    }
    // start loading wheel, disable place order button
    onPendingChange(true)
    // save Insight payment fields to Local storage
    // work on 3ds
    const onError = () => {
      handleAddMessage(paymetricErrorMessage, 'error')
    }
    const onInvalid = () => {
      onPendingChange(false)
    }

    // Get Paymetric access token if it is available
    const { accessToken, iFrameUrl, merchantGuid } = payMetricRef.current
      ? payMetricRef.current
      : {}
    const onSuccess = async () => {
      const historyObj = { pathname: PAGE_ROUTE.PROCESS }
      if (accessToken) {
        historyObj.search = `?id=${accessToken}`
      }
      // navigate to process order page
      history.push(historyObj);
    }
    const additionalFields = {
      ACSWindowSize: paymentState.challengeWindowSize,
    }

    // add new card scenario

    const iFrameId = 'paymetric-iframe'
    // 3DS2 XIFrame submit
    storePaymentInfoForCardScreening({
      webRefNumber: paymentState.webReferenceNumber,
      isNewCard: true,
      billingRequest,
      paymentType: values.paymentMethod,
    })
    // trigger 3DS2, and backend enables it with supported currency
    paymetric3DS2SubmitIframe({
      iFrameId,
      merchantGuid,
      accessToken,
      iFrameUrl,
      onSuccess,
      onError,
      onInvalid,
      challenge3DS2Handler,
      additionalFields,
    })
  }

  const validateShoppingRequestForPrices = async () => {
    const shoppingReqFromStorage = getPersistCheckoutFromStorage();
    const lineLevelSessionInfos = shoppingReqFromStorage?.lineLevelSessionInfos;
    const invalidMaterials = shoppingReqFromStorage?.invalidIds;
    try {
      return await validateShoppingRequest({ shoppingRequest, lineLevelSessionInfos, invalidMaterials });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div>
        {prop65ComplianceData.length > 0 && (
          prop65ComplianceData.map((warning) => (
            <Message type="warning">
              {<span dangerouslySetInnerHTML={{ __html: warning }}></span>}
            </Message>
          ))
        )}
      </div>
      <div className='o-grid o-grid--gutters-small'>
        <Helmet>
          <title>{t('Review order')}</title>
          <meta name="description" content={t('Review order page')} />
        </Helmet>
        <div className='o-grid__item u-1/1 u-3/4@desktop'>
          <PaymentSection
            payMetricCallback={payMetricCallback}
            paymentState={paymentState}
            payMetricRef={payMetricRef}
            paymentInsightFormRef={paymentInsightFormRef}
            onPendingChange={onPendingChange}
            onPaymentMethodChange={onPaymentMethodChange}
            saveAdditionalPaymentFields={saveAdditionalPaymentFields}
          />
          <CustomerOrderInfoView title='Customer information' data={orderMetaData?.userContact} isEditable={true} />
          {orderHasSellRequirements() && (<CustomerOrderInfoView title='Order information' data={orderMetaData?.licenseContact} isEditable={true} />)}
          <AddressSection
            type={'shipping-address'}
            address={{ ...address, attentionLine, companyName, phone: shippingPhone }}
            onEdit={onShipBillEdit}
          />
          {hasShippableItems && <ShippingOptionsView shippingMethod={shippingMethod} notificationEmails={additionalShippingNotificationEmail}
            onEdit={() => onShipBillEdit('shipping-options')} />}
          <AddressSection
            type={'billing-address'}
            address={{ ...billingAddress, attentionLine: billingAttentionLine, companyName: billingCompanyName, phone: billingPhone }}
            onEdit={onShipBillEdit}
          />
          <CartView shoppingRequest={shoppingRequest} />
        </div>
        <div className='o-grid__item u-1/1 u-1/4@desktop'>
          <Summary
            currencyCode={shoppingRequest?.soldTo?.currencyCode}
            subtotal={cart?.summary?.subTotal}
            estimatedShipping={cart?.summary?.shippingCost}
            estimatedTax={cart?.summary?.taxCost}
            ewrFee={cart?.summary?.ewrFee}
            total={cart?.summary?.totalCost}
            pstTaxCost={cart?.summary?.pstTaxCost}
            gstHstTaxCost={cart?.summary?.gstHstTaxCost}
            locale={shoppingRequest?.locale}
          >
            <PlaceOrderButton
              handlePlaceOrder={handlePlaceOrderButton}
              isPaymentInProgress={paymentState.pending}
              isPaymetricReady={!paymentState.loading}
            />
          </Summary>
        </div>
        {paymentState.showChallenge && (
          <PaymetricChallengeIframe
            iFrameId="paymetric-challenge"
            size={paymentState.challengeWindowSize}
            challengeEvent={paymentState.challengeEvent}
          />
        )}
      </div>
    </>
  );
};

export default connectToLocale(ReviewOrder);
