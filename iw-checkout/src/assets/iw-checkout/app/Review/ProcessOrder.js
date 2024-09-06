import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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
import { msgBox, IWMessageBox } from '../../libs/iw-components'
import {
  selector_cart,
  selector_cartItemsGAE,
} from '../../libs/Cart/selectors/cartResponse'
import {
  getShoppingRequest,
  proceedToCheckout,
} from '../../libs/ShoppingRequest/actions'
import {
  selector_shoppingRequest,
  selector_shoppingRequestCartItems,
} from '../../libs/ShoppingRequest/selectors'
import {
  getTaxAndEWRFee,
  prop65Compliance,
  updatePaymentMethodDefault,
  updatePaymentCardDefault,
  validateReviewOrder,
  updatePayment,
  createCard,
} from './../ShipBillPay/actions'
import { selector_paymentRequired } from '../ShipBillPay/selectors'
import {
  selector_isB2BUser,
  selector_cdmUid,
  selector_userSalesOrg,
  selector_sessionId,
  selector_country,
  selector_loginAsFlag,
} from '../../libs/User/selectors'
import { selector_isEnableCreditCardMessage } from '../../app/messages/selectors'
import {
  selector_isRequisition,
  selector_isCyberSource,
} from '../LineLevel/selectors'
import { getDigitalDataCheckoutType } from '../../libs/Cart/selectors/shoppingCartView'
import {
  prepareCardInfo,
  transformStoredCardToCardInfo,
} from './components/PaymentInfo/paymentInfoHelpers'
import { getCartWithOutTaxAndShipping } from '../../libs/businessContainerApps/cart/actions'
import {
  fetchPopulateUIFlags,
  fetchSmartTrackers,
  fetchOrderMetaData,
} from '../../libs/OrderMetaData/actions'
import { submit3DSPayMetricData } from './../../libs/models/Payments/payment'
import { placeOrder } from '../Review/actions/placeOrderActions'
import ROUTES from '../../libs/routes'
import {
  PROCESS_ORDER_TITLE,
  RECEIPT_TITLE,
} from '../../libs/businessContainerApps/checkoutAppHeader/constants'
import { CARD_SCREEN_INFO } from './constants'
import { PURCHASE_CHECKOUT_TYPE } from '../libs/constants'

function ProcessOrder({
  cartItemsGAE,
  cart,
  digitalDataCheckoutType,
  getTaxAndEWRFeeApi,
  prop65ComplianceApi,
  getShoppingRequestApi,
  getCartWithOutTaxAndShippingApi,
  fetchPopulateUIFlagsApi,
  updatePaymentCardDefaultApi,
  validateReviewOrderApi,
  updatePaymentApi,
  proceedToCheckoutApi,
  placeOrderApi,
  fetchSmartTrackersApi,
  fetchOrderMetaDataApi,
  createCardApi,
  hasShoppingRequest,
  isB2BUser,
  cdmUid,
  country,
  sessionId,
  salesOrg,
  shoppingCartItems,
  shoppingRequest,
  isPaymentRequired,
  isEnableCreditCardMessage,
  isLoginAs,
  isRequisition,
  isCyberSource,
  context,
  history,
}) {
  const [readyToPlaceOrder, setReadyToPlaceOrder] = useState(false)
  const [propsForCardScreening, setPropsForCardScreening] = useState({})
  const isPurchaseAnalyticFlagEnabled = window.flags && window.flags['GNA-12643-PURCHASE-ANALYTICS']

  const unexpectedErrorHandler = (error) => {
    console.warn('error', error)
    msgBox.addMsg('shopping-cart', {
      text: t(
        'An unexpected error occurred. Please contact your Account Executive for more information.'
      ),
      severity: 'error',
      scrollTo: '.SBP__messages',
    })
    history.push({ pathname: ROUTES.PLACE_ORDER })
  }

  const declinedTransactionHandler = () => {
    msgBox.addMsg('shopping-cart', {
      text: t(
        'The transaction was declined.  Please use a different card or contact your bank/financial institution.'
      ),
      severity: 'error',
      scrollTo: '.SBP__messages',
    })
    history.push({ pathname: ROUTES.PLACE_ORDER })
  }

  useEffect(() => {
    document.title = t(PROCESS_ORDER_TITLE)
    msgBox.clear('shopping-cart')

    const checkoutForCardScreening = getSessionStorage(CARD_SCREEN_INFO)

    //get checkout props from sessionStorage
    if (checkoutForCardScreening) {
      setPropsForCardScreening(checkoutForCardScreening)
      sessionStorage.removeItem(CARD_SCREEN_INFO)

      const { isQuickCheckout } = checkoutForCardScreening

      // when 3DS2 challenge window is required, we will need to fetch the data again after full page redirect
      if (!hasShoppingRequest) {
        Promise.all([
          getCartWithOutTaxAndShippingApi(),
          getShoppingRequestApi(),
          fetchSmartTrackersApi(),
          fetchOrderMetaDataApi(),
          fetchPopulateUIFlagsApi(),
          isQuickCheckout ? getTaxAndEWRFeeApi() : Promise.resolve(0),
          isQuickCheckout ? prop65ComplianceApi() : Promise.resolve(0),
        ])
          .then(() => {
            setReadyToPlaceOrder(true)
          })
          .catch((error) => {
            unexpectedErrorHandler(error)
          })
      } else {
        setReadyToPlaceOrder(true)
      }
    } else {
      //replace redirect back to cart to handle back button scenario
      window.location.replace(`/insightweb${ROUTES.VIEW_CART}`)
    }
  }, [])

  useEffect(() => {
    if (readyToPlaceOrder) {
      const { isSavedQuote, isOrderTemplate, isQuickCheckout } =
        propsForCardScreening

      if (hasShoppingRequest) {
        handlePaymentSubmit()
      } else {
        unexpectedErrorHandler(error)
      }
    }
  }, [readyToPlaceOrder])

  const handlePaymentSubmit = () => {
    //get access token from Paymetric challenge redirect
    const searchParams = new URLSearchParams(window.location.search)
    const accessToken = searchParams.get('id')

    const { isCES } = context
    const {
      webRefNumber,
      addToStoredCards,
      storedCardDesc,
      isDefaultCard,
      billingRequest,
      isNewCard,
      cardToUse,
      paymentType,
      cvvNumber,
    } = propsForCardScreening

    if (isNewCard || !cardToUse) {
      // using new card 3DS2 scenario
      submit3DSPayMetricData({
        accessToken,
        webReference: webRefNumber, //this is needed for Full Auth
        //new card authorization is only required when user is not a requestor or loginAs, and backend enables it with supported currency
        cvvRequired: !isRequisition && !isLoginAs && isCyberSource,
        enable3DS: !isRequisition && !isLoginAs && isCyberSource,
        messageType: addToStoredCards ? 'CSTO' : 'CGEN',
      })
        .then((paymetricsCardInfo) => {
          //if api returns the card token, that means authorization passed
          if (paymetricsCardInfo && paymetricsCardInfo.token) {
            const cardInfo = prepareCardInfo({
              paymetricsCardInfo,
              addToStoredCards,
              storedCardDesc,
              isDefaultCard,
              isCES,
            })
            submitPaymentCard(
              billingRequest,
              {
                webRefNumber,
                isPaymentRequired,
                createCardApi,
                paymentType,
              },
              cardInfo
            )
          } else {
            declinedTransactionHandler()
          }
        })
        .catch((error) => {
          unexpectedErrorHandler(error)
        })
    } else {
      // using saved card scenario

      const savedCardOrder = () => {
        updatePaymentToShoppingRequest(
          {
            ...billingRequest,
            cardInfo: transformStoredCardToCardInfo(cardToUse),
          },
          {
            webRefNumber,
          }
        )
        if (isDefaultCard) {
          updatePaymentCardDefaultApi(
            cardToUse.storedCardMethodId,
            cardToUse.storedCardId
          )
        }
      }

      //authorization is only needed for user who is not a requestor or loginAs, and backend enables it with supported currency
      if (!isRequisition && !isLoginAs && isCyberSource) {
        submit3DSPayMetricData({
          accessToken,
          webReference: webRefNumber, //this is needed for Full Auth
          card: {
            //this is needed when using a saved card
            storedCardId: cardToUse.storedCardId,
            storedCardType: cardToUse.storedCardType,
            storedCardHolderName: cardToUse.storedCardHolderName,
            storedCardExpMonth: cardToUse.storedCardExpMonth,
            storedCardExpYear: cardToUse.storedCardExpYear,
          },
          cvv: cvvNumber, //this is needed when using a saved card
          cvvRequired: true,
          enable3DS: true,
          messageType: 'CUSE', //@todo: Phase 2: Implement network id for each stored card.  If network id exists, send CUSE. If not, send CSTO
        })
          .then((paymetricsCardInfo) => {
            //if api returns the card token, that means authorization passed
            if (paymetricsCardInfo && paymetricsCardInfo.token) {
              savedCardOrder()
            } else {
              declinedTransactionHandler()
            }
          })
          .catch((error) => {
            unexpectedErrorHandler(error)
          })
      } else {
        savedCardOrder()
      }
    }
  }

  const updatePaymentToShoppingRequest = (billingRequest, paymentProps) => {
    updatePaymentApi(billingRequest)
      .then(getShoppingRequestApi)
      .then(validateReviewOrderApi)
      .then(({ value }) => {
        paymentOptionsGAE(3, billingRequest)
        if (value.length > 0) {
          msgBox.addMsg('shopping-cart', {
            text: t('Errors must be corrected before saving.'),
            severity: 'error',
            scrollTo: '.SBP__messages',
          })
        } else {
          msgBox.clear('shopping-cart')

          if (isB2BUser) {
            const pathname = ROUTES.CART_TRANSFER
            history.push({ pathname })
          } else {
            proceedToCheckoutApi({ source: 'PAYMENT' }).then(() => {
              submitPlaceOrder(paymentProps.webRefNumber)
            })
          }
        }
      })
      .catch((error) => {
        unexpectedErrorHandler(error)
      })
  }

  const submitPaymentCard = (billingRequest, paymentProps, cardInfo) => {
    // create credit card or proc card
    // we need this as we dont want to mutate values object from redux form
    // const cardInfo = { ...values.cardInfo }
    if (paymentProps.isPaymentRequired && Object.keys(cardInfo).length === 0) {
      // no need to create card, submit payment
      this.updatePaymentToShoppingRequest({ ...billingRequest }, paymentProps)
      return false
    }
    // need to remove this as this key as it is not accepted by backend
    // by not mutating, we are not effecting form fields by removing this key
    delete cardInfo.addToStoredCards

    paymentProps
      .createCardApi({
        ...cardInfo,
        storedCardMethodId: paymentProps.paymentType,
      })
      .then(({ value }) => {
        // once card created, update payment to Shopping request
        if (
          value.exceptionExists &&
          value.exceptionsList &&
          Array.isArray(value.exceptionsList) &&
          value.exceptionsList.includes('INVALID_CARD')
        ) {
          msgBox.addMsg('shopping-cart', {
            text: value.exceptionsList.join(', '),
            severity: 'error',
            scrollTo: '.SBP__messages',
          })
        } else {
          msgBox.clear('shopping-cart')
          updatePaymentToShoppingRequest(
            {
              ...billingRequest,
              cardInfo: transformStoredCardToCardInfo(value),
            },
            paymentProps
          )
        }
      })
  }

  const submitPlaceOrder = (webRefNumber) => {
    const { isQuickCheckout, isOrderTemplate, isSavedQuote } =
      propsForCardScreening
    const checkoutType = (isPurchaseAnalyticFlagEnabled && isRequisition) ? PURCHASE_CHECKOUT_TYPE.REQUISITION_REQUESTED :
      digitalDataCheckoutType === PURCHASE_CHECKOUT_TYPE.CHECKOUT ? PURCHASE_CHECKOUT_TYPE.CHECKOUT : PURCHASE_CHECKOUT_TYPE.QUICK_CHECKOUT

    checkoutGAE({
      step: 5,
      cart,
      cartItems: cartItemsGAE,
      isSavedQuote,
      isOrderTemplate,
      isQuickCheckout,
      overridePageTitle: RECEIPT_TITLE,
    })

    placeOrderApi({ webReferenceNumber: webRefNumber || 0 })
      .then(({ value }) => {
        signalRequest()
        let { redirectUrl } = value
        let confirmOrderCallback = null
        if (redirectUrl) {
          if (isEnableCreditCardMessage) {
            const paramDelimiter = redirectUrl.indexOf('?') > -1 ? '&' : '?'
            redirectUrl = `${redirectUrl}${paramDelimiter}info=1`
          }
          confirmOrderCallback = function () {
            document.location = this.confirmOrderUrl
          }.bind({ confirmOrderUrl: redirectUrl })
        }
        try {
          const newShoppingRequest = {
            ...shoppingRequest,
            webReferenceNumber: value.webReferenceNumber,
          }
          receiptGAE(
            newShoppingRequest,
            isSavedQuote,
            isOrderTemplate,
            isQuickCheckout,
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
          history.push({ pathname: ROUTES.RECEIPT })
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  const signalRequest = () => {
    const locale = getCurrentLocale('insight_locale')
    const signals = shoppingCartItems
      .map((cartItem) => {
        if (cartItem.cartItemMetaData?.signalMetaData) {
          return {
            country,
            materialId: cartItem.materialInfo.materialId,
            locale,
            salesOrg,
            sku: cartItem.materialInfo.materialId,
            signalMetaData: cartItem.cartItemMetaData.signalMetaData,
            type: 'purchase',
            sessionId,
            userId: cdmUid,
          }
        }
      })
      .filter(Boolean)
    sendSignal(signals)
  }

  return (
    <div className="c-process-order">
      <IWMessageBox boxId="shopping-cart" Content={() => null} />
      <Modal
        size="medium"
        isOpen="true"
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
  )
}

function mapStateToProps(state) {
  return {
    cart: selector_cart(state),
    cartItemsGAE: selector_cartItemsGAE(state),
    digitalDataCheckoutType: getDigitalDataCheckoutType(state),
    hasShoppingRequest: Object.keys(selector_shoppingRequest(state)).length > 0,
    isB2BUser: selector_isB2BUser(state),
    shoppingRequest: selector_shoppingRequest(state),
    cdmUid: selector_cdmUid(state),
    country: selector_country(state),
    sessionId: selector_sessionId(state),
    salesOrg: selector_userSalesOrg(state),
    shoppingCartItems: selector_shoppingRequestCartItems(state),
    isPaymentRequired: selector_paymentRequired(state),
    isEnableCreditCardMessage: selector_isEnableCreditCardMessage(state),
    isRequisition: selector_isRequisition(state),
    isCyberSource: selector_isCyberSource(state),
    isLoginAs: selector_loginAsFlag(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTaxAndEWRFeeApi: getTaxAndEWRFee,
      getCartWithOutTaxAndShippingApi: getCartWithOutTaxAndShipping,
      prop65ComplianceApi: prop65Compliance,
      getShoppingRequestApi: getShoppingRequest,
      fetchPopulateUIFlagsApi: fetchPopulateUIFlags,
      updatePaymentCardDefaultApi: updatePaymentCardDefault,
      updatePaymentMethodDefaultApi: updatePaymentMethodDefault,
      validateReviewOrderApi: validateReviewOrder,
      updatePaymentApi: updatePayment,
      proceedToCheckoutApi: proceedToCheckout,
      placeOrderApi: placeOrder,
      fetchSmartTrackersApi: fetchSmartTrackers,
      fetchOrderMetaDataApi: fetchOrderMetaData,
      createCardApi: createCard,
    },
    dispatch
  )
}

ProcessOrder.propTypes = {
  history: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  cartItemsGAE: PropTypes.array.isRequired,
  hasShoppingRequest: PropTypes.bool.isRequired,
  isB2BUser: PropTypes.bool.isRequired,
  shoppingRequest: PropTypes.object.isRequired,
  cdmUid: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  sessionId: PropTypes.string.isRequired,
  salesOrg: PropTypes.string.isRequired,
  shoppingCartItems: PropTypes.array.isRequired,
  isPaymentRequired: PropTypes.bool.isRequired,
  isEnableCreditCardMessage: PropTypes.bool.isRequired,
  isRequisition: PropTypes.bool.isRequired,
  isCyberSource: PropTypes.bool.isRequired,
  isLoginAs: PropTypes.bool.isRequired,
  context: PropTypes.object.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(connectToLocale(ProcessOrder))
