import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Modal from '@insight/toolkit-react/lib/Modal/Modal'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import { connectToLocale } from '@insight/toolkit-react/lib/Locale/Locale'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { t } from '@insight/toolkit-utils/lib/labels'
import { sendSignal } from 'app-api-user-service'
import {
  checkoutGAE,
  paymentOptionsGAE,
  receiptGAE,
} from '@insight/toolkit-utils/lib/analytics'
import { getSessionStorage } from '@insight/toolkit-utils/lib/helpers/sessionStorageHelper'
import {CARD_SCREEN_INFO, GUEST_CHECKOUT_ENABLED, PAGE_ROUTE, ROUTES } from './../../constants'
import { selector_shoppingRequest, selector_cartItemsGAE } from '../../state/slices/selectors/ShoppingReqeustSelector'
import {
  submit3DSPayMetricData,
  savePaymentToShoppingRequest,
  validateShoppingRequest,
  placeOrder,
} from '../../api'
import { selector_lineLevelSessionInfos } from '../../state/slices/selectors/lineLevelSessionInfosSelector'
import { save as saveShoppingRequest } from './../../state/slices/shoppingRequestSlice'
import { save as saveLineLevelSessionInfos } from './../../state/slices/lineLevelSessionInfosSlice'
import { setReceipt } from './../../state/slices/receiptSlice'
import { setReceiptHeader } from './../../state/slices/receiptHeaderSlice'
import { addMessage, clearAllMessages } from '../../state/slices/messageSlice'
import { PURCHASE_CHECKOUT_TYPE } from '../../constants'
import { hasCookie, getCookie } from "@insight/toolkit-utils/lib/helpers/cookieHelpers";

const ProcessOrder = (props) => {
  const { context } = props
  const { sessionId, salesOrg } = context
  const [readyToPlaceOrder, setReadyToPlaceOrder] = useState(false)
  const [modalOpen, setModalOpen] = useState(true)
  const [propsForCardScreening, setPropsForCardScreening] = useState({})
  const history = useHistory()
  const dispatch = useDispatch()
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const { billing } = shoppingRequest
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
  const hasShoppingRequest = Object.keys(shoppingRequest).length > 0
  const paymentErrorMessage = t(
    'An unexpected error occurred. Please contact your Account Executive for more information.'
  )
//  const isGuestCheckoutFlow = hasCookie(GUEST_CHECKOUT_ENABLED) ? getCookie(GUEST_CHECKOUT_ENABLED): null;
//  const checkoutType = isGuestCheckoutFlow ? PURCHASE_CHECKOUT_TYPE.GUEST_CHECKOUT : undefined
  /*  Commenting above lines and for now sending always guest checkout . future, when we expand this app to all checkout, will uncomment those lines */
  const checkoutType = PURCHASE_CHECKOUT_TYPE.GUEST_CHECKOUT
  const cartItemsGAE = useSelector((cartItems) =>
    selector_cartItemsGAE(cartItems)
  )

  useEffect(() => {
    const checkoutForCardScreening = getSessionStorage(CARD_SCREEN_INFO)
    //get checkout props from sessionStorage
    if (checkoutForCardScreening) {
      setPropsForCardScreening(checkoutForCardScreening)
      sessionStorage.removeItem(CARD_SCREEN_INFO)
      // when 3DS2 challenge window is required, we will need to fetch the data again after full page redirect
      if (hasShoppingRequest) {
        // we do not need to fetch anything from backend as UI holds shopping request in local storage
        setReadyToPlaceOrder(true)
      } else {
        unexpectedErrorHandler(error)
        // navigate to cart, backend will not have any info on cart
        window.location.replace(`/insightweb${PAGE_ROUTE.CART}`)
      }
    } else {
      //replace redirect back to cart to handle back button scenario
      window.location.replace(`/insightweb${PAGE_ROUTE.CART}`)
    }
  }, [])
  useEffect(() => {
    if (readyToPlaceOrder) {
      if (hasShoppingRequest) {
        handlePaymentSubmit()
      } else {
        unexpectedErrorHandler(error)
      }
    }
  }, [readyToPlaceOrder])

  const handleAddMessage = (messageText, type) => {
    dispatch(addMessage({ text: messageText, type }))
  }

  const handleClearMessages = (messageText, type) => {
    dispatch(clearAllMessages())
  }

  const handlePaymentSubmit = () => {
    handleClearMessages()
    //get access token from Paymetric challenge redirect
    const searchParams = new URLSearchParams(window.location.search)
    const accessToken = searchParams.get('id')
    const { webRefNumber, billingRequest, isNewCard, paymentType, cvvNumber } =
      propsForCardScreening
    if (isNewCard) {
      // using new card 3DS2 scenario
      submit3DSPayMetricData({
        accessToken,
        webReference: webRefNumber,
        //this is needed for Full Auth
        //new card authorization is required when user is guest, and backend enables it with supported currency
        cvvRequired: true,
        enable3DS: true,
        messageType: 'CGEN',
        shoppingRequest,
      })
        .then((paymetricsCardInfo) => {
          //if api returns the card token, that means authorization passed
          if (paymetricsCardInfo && paymetricsCardInfo.token) {
            const cardInfo = prepareCardInfo({ paymetricsCardInfo })
            submitPaymentCard(
              billingRequest,
              {
                webRefNumber,
                isPaymentRequired: true,
                paymentType,
              },
              cardInfo
            )
          } else {
            // did not receive token from paymetrics
            declinedTransactionHandler()
          }
        })
        .catch((error) => {
          unexpectedErrorHandler(error)
        })
    }
  }

  const submitPaymentCard = (billingRequest, paymentProps, cardInfo) => {
    // create credit card or proc card
    // since user is guest user, we do not need to save card
    if (paymentProps.isPaymentRequired) {
      // no need to create card, submit payment to shopping request
      const request = {
        ...billing,
        payment: {
          ...billingRequest,
          cardInfo,
        },
      }
      savePaymentToShoppingRequest(
        shoppingRequest,
        lineLevelSessionInfos,
        JSON.stringify(request)
      )
        .then((data) => {
          // invoke validate /review cart api
          paymentOptionsGAE(3, billingRequest)
          submitPlaceOrder(paymentProps.webRefNumber, { shoppingRequest: data })
        })
        .catch((error) => {
          unexpectedErrorHandler(error)
          setModalOpen(false)
        })
      return false
    }
  }

  const submitPlaceOrder = (webRefNumber, validatedSR) => {
    const { shoppingRequest } = validatedSR

    checkoutGAE({
      step: 5,
      cart: shoppingRequest.cart.summary,
      cartItems: cartItemsGAE,
      isSaveAsQuote: false,
      isOrderTemplate: false,
      isQuickCheckout: false,
      overridePageTitle: ROUTES['PROCESS'].name,
    })

    // submit to analytics
    // invoke place order api

    placeOrder({ ...shoppingRequest, webReferenceNumber: webRefNumber || 0 })
      .then((value) => {
        // empty shopping request later in receipt page
        signalRequest(validatedSR)
        dispatch(
          setReceipt({ ...validatedSR, lineLevelSessionInfos, ...value })
        )
        const { billing, cart, soldTo, locale } = shoppingRequest
        const { summary } = cart
        const { payment } = billing

        dispatch(
          setReceiptHeader({
            ...value,
            poNumber: payment.poNumber,
            poReleaseNumber: payment.poReleaseNumber,
            totalCost: summary.totalCost,
            currencyCode: soldTo.currency,
            locale: locale,
          })
        )
        let confirmOrderCallback = null
        let { redirectUrl } = value
        try {
          const newShoppingRequest = {
            ...validatedSR.shoppingRequest,
            webReferenceNumber: value.webReferenceNumber,
          }
          receiptGAE(
            newShoppingRequest,
            false,
            false,
            false,
            confirmOrderCallback,
            checkoutType
          )
        } catch (error) {
          console.warn(error)
          if (redirectUrl) {
            document.location = redirectUrl
          }
        }
        if (redirectUrl) {
          // If google analytics isn't loaded, we need to switch URLs anyway,
          // but the GAE callback should have already been called.
          if (!window.gaGlobal) {
            document.location = redirectUrl
          }
        } else {
          history.push({ pathname: PAGE_ROUTE.RECEIPT })
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  const signalRequest = (validatedSR) => {
    const locale = getCurrentLocale('insight_locale')
    const {
      shoppingRequest: { cart },
    } = validatedSR
    const { cartItems } = cart
    const signals = cartItems
      .map((cartItem) => {
        if (cartItem.cartItemMetaData?.signalMetaData) {
          return {
            country: locale.split('_')[1],
            materialId: cartItem.materialInfo.materialId,
            locale,
            salesOrg,
            sku: cartItem.materialInfo.materialId,
            signalMetaData: cartItem.cartItemMetaData.signalMetaData,
            type: 'purchase',
            sessionId,
            userId: 0,
          }
        }
      })
      .filter(Boolean)
    sendSignal(signals)
  }

  const unexpectedErrorHandler = (error) => {
    console.warn('error', error)
    handleAddMessage(paymentErrorMessage, 'error')
    history.push({ pathname: PAGE_ROUTE.CART })
  }

  const declinedTransactionHandler = () => {
    handleAddMessage(
      t(
        'The transaction was declined.  Please use a different card or contact your bank/financial institution.'
      ),
      'error'
    )
    history.push({ pathname: PAGE_ROUTE.CART })
  }

  return (
    <div>
      <Helmet>
        <title>{t('Process order')}</title>
        <meta name="description" content={t('Process order page')} />
      </Helmet>
      <div className="c-process-order">
        <Modal
          size="medium"
          isOpen={true}
          overlayclassname="c-modal-overlay"
          className="c-process-order__modal"
        >
          <Modal.Body>
            <section className="u-text-center">
              <Loading size="large" />
              <div className="c-process-order__modal__message u-text-bold">
                {t('Processing your order...')}
              </div>
            </section>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export default connectToLocale(ProcessOrder)

function prepareCardInfo({ paymetricsCardInfo }) {
  return {
    expiryMonth: paymetricsCardInfo.expiryMonth,
    expiryYear: paymetricsCardInfo.expiryYear,
    nameOnCard: paymetricsCardInfo.cardHolderName,
    token: paymetricsCardInfo.token,
    type: paymetricsCardInfo.type,
    maskedCardNumber: paymetricsCardInfo.maskedCardNumber,
  }
}
