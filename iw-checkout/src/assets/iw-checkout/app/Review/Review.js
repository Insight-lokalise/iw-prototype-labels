import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { submit, formValues } from 'redux-form'

import { t } from '@insight/toolkit-utils/lib/labels'
import { connectToLocale } from '@insight/toolkit-react/lib/Locale/Locale'
import { PaymetricChallengeIframe } from '@insight/toolkit-react/lib/Paymetric/PaymetricChallengeIframe'
import {
  paymetricSubmitIframe,
  paymetric3DS2SubmitIframe,
  paymetric3DS2SubmitAjax,
} from '@insight/toolkit-react/lib/Paymetric/paymetricHelpers'
import {
  checkoutGAE,
  paymentOptionsGAE,
} from '@insight/toolkit-utils/lib/analytics'
import {
  setSessionStorage,
  getSessionStorage,
} from '@insight/toolkit-utils/lib/helpers/sessionStorageHelper'

import CartSummary from '../../libs/businessContainerApps/cartSummary/CartSummary'
import CartSummarySimple from '../../libs/businessContainerApps/cartSummarySimple/CartSummarySimple'
import Cart from '../../libs/businessContainerApps/cart/cart'
import { IWAccordion, IWLoading, msgBox } from '../../libs/iw-components'
import AddressSection from '../ShipBillPay/containers/AddressSection/AddressSectionWrapper'
import ShippingOptions from '../ShipBillPay/containers/ShippingOptions/ShippingOptionsWrapper'
import PaymentInfo from './containers/PaymentInfo/PaymentInfoWrapper'
import PaymentInfoOld from './../ShipBillPay/containers/PaymentInfo/PaymentInfoWrapper'
import AdditionalInformation from '../LineLevel/components/AdditionalInfo/AdditionalInfoAccordion'
import PlaceOrderButton from './components/PlaceOrderButton/PlaceOrderButton'
import ReviewReceiptMessageHeader from './components/ReviewReceiptMessageHeader/ReviewReceiptMessageHeader'
import {
  selector_cart,
  selector_isOrderTemplate,
  selector_cartItemsGAE,
  selector_isSavedQuote,
} from '../../libs/Cart/selectors/cartResponse'
import { selector_isQuickCheckout } from '../../libs/Cart/selectors/shoppingCartView'
import { bindActionCreators } from 'redux'
import { getTaxAndEWRFee, prop65Compliance } from './../ShipBillPay/actions'
import { getCartWithOutTaxAndShipping } from '../../libs/businessContainerApps/cart/actions'
import CartPrintHeader from '../ShoppingCart/components/printPreview/CartPrintHeader'
import { PLACE_ORDER_TITLE } from '../../libs/businessContainerApps/checkoutAppHeader/constants'
import CartSummaryEmail from '../../libs/businessContainerApps/orderUtilities/CartSummaryEmailSection/CartSummaryEmail'
import { getShoppingRequest } from './../../libs/ShoppingRequest/actions'
import {
  selector_shoppingRequest,
  selector_taxIsPending,
} from './../../libs/ShoppingRequest/selectors'
import ROUTES from '../../libs/routes'
import { cardTypes, CARD_SCREEN_INFO } from './constants'
import creditCardType from 'credit-card-type'
import {
  checkExpired,
  prepareCardInfo,
  transformStoredCardToCardInfo,
} from './components/PaymentInfo/paymentInfoHelpers'
import {
  selector_isEMEA,
  selector_loginAsFlag,
} from '../../libs/User/selectors'
import {
  selector_isRequisition,
  selector_isCyberSource,
} from '../LineLevel/selectors'
import {
  createCardEMEA,
  submitPayMetricData,
} from './../../libs/models/Payments/payment'
import { selector_featureFlags } from '../../libs/flags/selectors'

const isIE =
  window.navigator.userAgent.includes('MSIE ') ||
  !!window.navigator.userAgent.match(/Trident.*rv\:11\./)

class Review extends Component {
  constructor(props) {
    super(props)
    this.payMetricRef = React.createRef()
    this.placeOrderRef = React.createRef()
    this.wpLibraryObjectRef = React.createRef()
    // @todo remove disable_feature_payment after pack one is merged with develop
    this.disable_feature_payment = false
    // state is not needed for review order page, this state is required for payment section
    this.state = {
      inAddCardView: false,
      addToStoredCards: false,
      isDefaultCard: false,
      isPaymetricReady: true,
      isPaymentInProgress: false,
      isPending: true,
      isProcurementCard: false,
      openStoredCardsModal: false,
      openPaymentModal: false,
      overrideTax: false,
      paymentType: 1,
      paymentFormValues: null,
      paymetricSuccess: false,
      storedCardDesc: '',
      webRefNumber: 0,
      requireCardInfo: false,
      showChallenge: false,
      challengeEvent: null,
      challengeWindowSize: '05',
      isoCodes: null,
      initialized: false,
    }
  }

  componentDidMount() {
    checkoutGAE({
      step: 4,
      cart: this.props.cart,
      cartItems: this.props.cartItemsGAE,
      isSaveAsQuote: this.props.isSavedQuote,
      isOrderTemplate: this.props.isOrderTemplate,
      isQuickCheckout: this.props.isQuickCheckout,
      overridePageTitle: PLACE_ORDER_TITLE,
    })
    this.props.getCartWithOutTaxAndShipping()
    if (!this.props.hasShoppingRequest) {
      this.props.getShoppingRequest()
    }

    if (this.props.isQuickCheckout) {
      this.props.getTaxAndEWRFee()
      this.props.prop65Compliance()
    }
  }

  componentDidUpdate() {
    if (!this.state.paymentType) {
      this.placeOrderRef.current.disablePlaceOrderButton()
      this.placeOrderRef.current.disableTermsCheckbox()
    }
    if (this.state.showChallenge) {
      this.fireChallengeIframeAnalytic()
    }
  }

  setPaymentState = (nextState) => {
    this.setState({ ...nextState })
  }

  updatePaymentToShoppingRequest = (billingRequest, paymentProps) => {
    this.setState({ isPaymentInProgress: true })
    paymentProps
      .updatePayment(billingRequest)
      .then(paymentProps.validateReviewOrder)
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
          if (paymentProps.isB2BUser) {
            const pathname = ROUTES.CART_TRANSFER
            paymentProps.history.push({ pathname })
          } else {
            paymentProps.proceedToCheckout({ source: 'PAYMENT' }).then(() => {
              this.placeOrderRef.current.submitPlaceOrder(
                this.state.webRefNumber
              )
            })
          }
        }
      })
  }

  handlePlaceOrder = () => {
    if (this.props.isEMEA) {
      this.props.submitPaymentForm('AddPaymentOrNewCardForm')
    } else {
      this.disable_feature_payment
        ? this.placeOrderRef.current.submitPlaceOrder()
        : this.props.submitPaymentForm('AddPaymentOrNewCardForm')
    }
  }

  handlePaymentSubmitEMEA = (values, dispatch, paymentProps) => {
    const { paymentState } = paymentProps
    // here props are payment form props. not review page props
    const { POSection, procurementFields = [] } = values
    const billingRequest = {
      type: paymentState.paymentType,
      option:
        paymentProps.availablePaymentMethodsMap[paymentState.paymentType]
          .paymentOptionTerms,
      ...POSection,
      procurementFields:
        paymentState.paymentType === 3 ? procurementFields : null,
    }

    if (paymentState.paymentType === 1) {
      this.updatePaymentToShoppingRequest({ ...billingRequest }, paymentProps)
    } else {
      // We will loose form values access in world pay callback, so we are setting form values to Review component state just for future use
      // we have already passed payment props to WP callback to gain access to Payment component actions, it will be easy to rewrite payment section,
      // once we move to world pay solution for NA & APAC, we can try to get rid of payment props as current code is spaghetti
      // we can also read it from redux-form using formValuesSelector but this is more performant
      paymentProps.setPaymentState({
        paymentFormValues: { ...values },
        openPaymentModal: true,
      })
    }
    if (values['payment-method__samd']) {
      paymentProps.updatePaymentMethodDefault(paymentState.paymentType)
    }
  }

  submitPaymentCard = (billingRequest, paymentProps, cardInfo) => {
    // create credit card or proc card
    // we need this as we dont want to mutate values object from redux form
    // const cardInfo = { ...values.cardInfo }
    if (!paymentProps.isPaymentRequired && Object.keys(cardInfo).length === 0) {
      // no need to create card, submit payment
      this.updatePaymentToShoppingRequest({ ...billingRequest }, paymentProps)
      return false
    }
    // need to remove this as this key as it is not accepted by backend
    // by not mutating, we are not effecting form fields by removing this key
    delete cardInfo.addToStoredCards
    // const storedCardType = cardTypes[creditCardType(cardInfo.storedCardToken)[0].type]
    // const storedCardType = cardInfo.storedCardType
    paymentProps
      .createCard({
        ...cardInfo,
        storedCardMethodId: paymentProps.paymentState.paymentType,
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
          this.updatePaymentToShoppingRequest(
            {
              ...billingRequest,
              cardInfo: transformStoredCardToCardInfo(value),
            },
            paymentProps
          )
        }
      })
  }

  challenge3DS2Handler = (challengeEvent) => {
    this.setState({ showChallenge: true, challengeEvent })
  }

  handlePaymentSubmit = (values, dispatch, paymentProps) => {
    msgBox.clear('shopping-cart')

    this.setState({ isPaymentInProgress: true })
    const { paymentState } = paymentProps
    // here props are payment form props. not review page props
    const { POSection, procurementFields = [], cvvNumber } = values
    const billingRequest = {
      type: paymentState.paymentType,
      option:
        paymentProps.availablePaymentMethodsMap[paymentState.paymentType]
          .paymentOptionTerms,
      ...POSection,
      procurementFields:
        paymentState.paymentType === 3 ? procurementFields : null,
    }

    const { isCES } = this.props.context
    const enableCardScreening = this.props.featureFlags['GNA-9004-CS']
    const { addToStoredCards, storedCardDesc, isDefaultCard } = this.state
    const cardToUse = getCardToUse(paymentProps) // incase of not new card
    const paymetricErrorMessage = {
      text: t(
        'An unexpected error occurred. Please contact your Account Executive for more information.'
      ),
      severity: 'error',
      scrollTo: '.SBP__messages',
    }
    const onError = () => {
      console.error('Paymetric onError')
      msgBox.addMsg('shopping-cart', paymetricErrorMessage)
    }
    const onInvalid = () => {
      this.setState({ isPaymentInProgress: false })
    }
    const onCatch = (error) => {
      console.error('Paymetric onCatch', error)
      this.setState({
        isPaymentInProgress: false,
        isPaymetricReady: false,
      })
      msgBox.addMsg('shopping-cart', paymetricErrorMessage)
    }

    // Get Paymetric access token if it is available
    const { accessToken, iFrameUrl, merchantGuid } = this.payMetricRef.current
      ? this.payMetricRef.current
      : {}

    const onSuccess = () => {
      const historyObj = { pathname: ROUTES.PROCESS_ORDER }
      if (accessToken) {
        historyObj.search = `?id=${accessToken}`
      }
      this.props.history.push(historyObj)
    }

    // 3DS2 XIFrame submit
    const {
      challenge3DS2Handler,
      state: { challengeWindowSize },
    } = this
    const additionalFields = {
      ACSWindowSize: challengeWindowSize,
    }

    if (values['payment-method__samd']) {
      paymentProps.updatePaymentMethodDefault(paymentState.paymentType)
    }

    if (paymentState.paymentType === 1) {
      this.updatePaymentToShoppingRequest({ ...billingRequest }, paymentProps)
    } else if (paymentState.inAddCardView || !cardToUse) {
      if (this.state.requireCardInfo) {
        // add new card scenario

        const iFrameId = 'paymetric-iframe'

        if (enableCardScreening) {
          // 3DS2 XIFrame submit
          storePaymentInfoForCardScreening({
            webRefNumber: paymentState.webRefNumber,
            isNewCard: true,
            addToStoredCards,
            storedCardDesc,
            isDefaultCard,
            billingRequest,
            paymentType: paymentState.paymentType,
            isQuickCheckout: this.props.isQuickCheckout,
            isOrderTemplate: this.props.isOrderTemplate,
            isSavedQuote: this.props.isSavedQuote,
          })

          // trigger 3DS2 if user is not a requestor or loginAs user, and backend enbles it with supported currency
          if (
            !this.props.isRequisition &&
            !this.props.isLoginAs &&
            this.props.isCyberSource
          ) {
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
          } else {
            paymetricSubmitIframe({
              iFrameId,
              iFrameUrl,
              onSuccess,
              onError,
              onInvalid,
            })
          }
        } else {
          // old XIFrame submit without 3DS2
          const onSuccessOld = () => {
            submitPayMetricData(accessToken)
              .then((paymetricsCardInfo) => {
                this.setState({ paymetricSuccess: true })

                const cardInfo = prepareCardInfo({
                  paymetricsCardInfo,
                  addToStoredCards,
                  storedCardDesc,
                  isDefaultCard,
                  isCES,
                })

                this.submitPaymentCard(billingRequest, paymentProps, cardInfo)
              })
              .catch((error) => {
                onCatch(error)
              })
          }

          paymetricSubmitIframe({
            iFrameId,
            iFrameUrl,
            onSuccess: onSuccessOld,
            onError,
            onInvalid,
          })
        }
      } else {
        // user decides not to include card info since it is not required in this scenario
        this.submitPaymentCard(billingRequest, paymentProps, {})
      }
    } else {
      // use saved card scenario
      const isExpired = checkExpired(
        cardToUse.storedCardExpMonth,
        cardToUse.storedCardExpYear
      )
      if (isExpired) {
        this.setState({ isPaymentInProgress: false })
        return false
      }

      if (enableCardScreening) {
        storePaymentInfoForCardScreening({
          webRefNumber: paymentState.webRefNumber,
          isNewCard: false,
          addToStoredCards,
          storedCardDesc,
          isDefaultCard: values['payment-card__samd'],
          paymetricRef: this.payMetricRef.current,
          billingRequest,
          cardToUse,
          isQuickCheckout: this.props.isQuickCheckout,
          isOrderTemplate: this.props.isOrderTemplate,
          isSavedQuote: this.props.isSavedQuote,
          cvvNumber,
        })

        // trigger 3DS2 if user is not a requestor or loginAs user, and backend enables it with supported currency
        if (
          !this.props.isRequisition &&
          !this.props.isLoginAs &&
          this.props.isCyberSource
        ) {
          paymetric3DS2SubmitAjax({
            merchantGuid,
            accessToken,
            onSuccess,
            onError,
            challenge3DS2Handler,
            additionalFields,
          })
        } else {
          this.props.history.push({ pathname: ROUTES.PROCESS_ORDER })
        }
      } else {
        this.updatePaymentToShoppingRequest(
          {
            ...billingRequest,
            cardInfo: transformStoredCardToCardInfo(cardToUse),
          },
          paymentProps
        )
        if (values['payment-card__samd']) {
          paymentProps.updatePaymentCardDefault(
            cardToUse.storedCardMethodId,
            cardToUse.storedCardId
          )
        }
      }
    }
  }

  handleWPSuccess = (paymentProps) => {
    const {
      webRefNumber,
      paymentFormValues,
      paymentType,
      storedCardDesc,
      inAddCardView,
      isDefaultCard,
    } = this.state
    const { procurementFields = [], POSection } = paymentFormValues
    const billingRequest = {
      type: paymentType,
      option:
        paymentProps.availablePaymentMethodsMap[paymentType].paymentOptionTerms,
      ...POSection,
      procurementFields: paymentType === 3 ? procurementFields : null,
    }
    // user choose add new card
    let createCardRequest = {
      webRefNum: webRefNumber,
      paymentMethod: paymentType,
      futureUse: false,
    }
    const cardToUse = getCardToUse(paymentProps)
    if (inAddCardView || !cardToUse) {
      // add new card
      createCardRequest = {
        ...createCardRequest,
        defaultCard: isDefaultCard,
        cardDescription: storedCardDesc,
        futureUse: !!storedCardDesc,
      }
    } else {
      // stored card selected
      const { storedCardId } = cardToUse
      createCardRequest = {
        ...createCardRequest,
        futureUse: false,
        storedCardId,
        defaultCard: isDefaultCard,
      }
    }

    createCardEMEA(createCardRequest)
      .then(() => {
        // card is submitted to WP and record saved to temporary card storage
        // continue with place order
        this.updatePaymentToShoppingRequest({ ...billingRequest }, paymentProps)
      })
      .catch((error) => {
        //
      })
  }

  worldPayResultCallback = (responseData, paymentProps) => {
    const { order, error } = responseData
    const { status } = order
    switch (status) {
      case 'success': {
        this.handleWPSuccess(paymentProps)
        break
      }
      case 'session_expired': {
        // world pay session expired
        // close payment modal and let user continue to payment again
        paymentProps.setPaymentState({
          openPaymentModal: false,
          openStoredCardsModal: false,
        })
        break
      }
      case 'failure':
      case 'error':
        msgBox.addMsg('shopping-cart', {
          text:
            error.messages && error.messages.length > 0
              ? error.messages.join(', ')
              : t(
                  'An unexpected error occurred. Please contact your Account Executive for more information.'
                ),
          severity: 'error',
          scrollTo: '.SBP__messages',
        })
        break
    }
  }

  payMetricCallback = (responseData) => {
    this.payMetricRef.current = responseData
  }

  renderCartSummary = (isCES) => {
    const OrderButton = (
      <PlaceOrderButton
        disable_feature_payment={this.disable_feature_payment}
        handlePlaceOrder={this.handlePlaceOrder}
        paymentType={this.state.paymentType}
        history={this.props.history}
        isPaymetricReady={this.state.isPaymetricReady}
        isPaymentInProgress={this.state.isPaymentInProgress}
        ref={this.placeOrderRef}
      />
    )

    return !isCES ? (
      <CartSummary showTax useShoppingRequestShipping>
        {OrderButton}
      </CartSummary>
    ) : (
      <CartSummarySimple showSaveForLater useShoppingRequestShipping>
        <div className="o-grid__item u-1/1">{OrderButton}</div>
      </CartSummarySimple>
    )
  }

  fireChallengeIframeAnalytic = () => {
    checkoutGAE({
      step: 4.5,
      cart: this.props.cart,
      cartItems: this.props.cartItemsGAE,
      isSaveAsQuote: this.props.isSavedQuote,
      isOrderTemplate: this.props.isOrderTemplate,
      isQuickCheckout: this.props.isQuickCheckout,
      overridePageTitle: PLACE_ORDER_TITLE,
    })
  }

  render() {
    const { hasShoppingRequest, context } = this.props
    const isCES = context && context.isCES

    return hasShoppingRequest ? (
      <div className="review-wrapper">
        <div className="row expanded small-collapse large-uncollapse">
          <div className="column">
            <CartPrintHeader className="show-for-print hide-for-print-modal" />
            <ReviewReceiptMessageHeader isReceipt={this.props.isReceipt} />
          </div>
        </div>
        <div className="row expanded small-collapse large-uncollapse">
          <div className="columns small-12 large-9 print-12">
            {!this.disable_feature_payment && (
              <div>
                <PaymentInfo
                  isCES={isCES}
                  paymentState={this.state}
                  setPaymentState={this.setPaymentState}
                  history={this.props.history}
                  getCardToUse={getCardToUse}
                  isPaymetricReady={this.state.isPaymetricReady}
                  isPaymentInProgress={this.state.isPaymentInProgress}
                  wpLibRef={this.wpLibraryObjectRef}
                  payMetricCallback={this.payMetricCallback}
                  worldPayResultCallback={this.worldPayResultCallback}
                  taxIsPending={this.props.taxIsPending}
                  onSubmit={
                    this.props.isEMEA
                      ? this.handlePaymentSubmitEMEA
                      : this.handlePaymentSubmit
                  }
                />
              </div>
            )}
            <IWAccordion name="Review" initialActiveIndex={9} expandAll>
              <AdditionalInformation
                history={this.props.history}
                redirectToSBPOnEdit
              />
              <AddressSection
                type="shipping"
                history={this.props.history}
                redirectToSBPOnEdit
                isCES={isCES}
              />
              <ShippingOptions
                history={this.props.history}
                redirectToSBPOnEdit
              />
              <AddressSection
                type="billing"
                history={this.props.history}
                redirectToSBPOnEdit
                isCES={isCES}
              />
              {this.disable_feature_payment && (
                <PaymentInfoOld
                  history={this.props.history}
                  redirectToSBPOnEdit
                />
              )}
            </IWAccordion>
            <div className="hide-for-medium">
              {this.renderCartSummary(isCES)}
            </div>
            <Cart
              history={this.props.history}
              className="cart"
              isCartPage={false}
              isReadOnly
              showReadOnlyLineLevels
              showReadOnlyDEPSection
            />
            {isIE && (
              <div className="hide print-show print-5 print-offset-7">
                {this.renderCartSummary(isCES)}
              </div>
            )}
          </div>
          <div
            className={`columns small-12 large-3 ${cn({
              'hide-for-print': isIE,
              'print-5': !isIE,
              'print-offset-7': !isIE,
            })}`}
          >
            <div
              className={`hide-for-small-only sticky-summary top-space-small ${cn(
                {
                  'top-space-large': !isCES,
                }
              )}`}
            >
              {this.renderCartSummary(isCES)}
            </div>
          </div>
        </div>
        <CartSummaryEmail showTax useShoppingRequestShipping />
        {this.state.showChallenge && (
          <PaymetricChallengeIframe
            iFrameId="paymetric-challenge"
            size={this.state.challengeWindowSize}
            challengeEvent={this.state.challengeEvent}
          />
        )}
      </div>
    ) : (
      <IWLoading modal className="iw-loading__size-giant" />
    )
  }
}

function mapStateToProps(state) {
  return {
    cart: selector_cart(state),
    cartItemsGAE: selector_cartItemsGAE(state),
    featureFlags: selector_featureFlags(state),
    isEMEA: selector_isEMEA(state),
    isSavedQuote: selector_isSavedQuote(state),
    isOrderTemplate: selector_isOrderTemplate(state),
    isQuickCheckout: selector_isQuickCheckout(state),
    hasShoppingRequest: Object.keys(selector_shoppingRequest(state)).length > 0,
    isRequisition: selector_isRequisition(state),
    isCyberSource: selector_isCyberSource(state),
    isLoginAs: selector_loginAsFlag(state),
    taxIsPending: selector_taxIsPending(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTaxAndEWRFee,
      getCartWithOutTaxAndShipping,
      prop65Compliance,
      getShoppingRequest,
      submitPaymentForm: submit,
      getPaymentFormValues: formValues,
    },
    dispatch
  )
}

Review.propTypes = {
  history: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  cartItemsGAE: PropTypes.array.isRequired,
  featureFlags: PropTypes.object.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  isSavedQuote: PropTypes.bool.isRequired,
  isOrderTemplate: PropTypes.bool.isRequired,
  isQuickCheckout: PropTypes.bool.isRequired,
  hasShoppingRequest: PropTypes.bool.isRequired,
  isRequisition: PropTypes.bool.isRequired,
  isCyberSource: PropTypes.bool.isRequired,
  isLoginAs: PropTypes.bool.isRequired,
  taxIsPending: PropTypes.bool.isRequired,
}

Review.defaultProps = {
  isReceipt: false,
}

const getCardToUse = (paymentProps) => {
  // this is used with payment form props
  // moved this method from payment form
  const {
    defaultCreditCard,
    defaultProcurementCard,
    creditCardFromShoppingRequest,
    procurementCardFromShoppingRequest,
    paymentState,
  } = paymentProps
  if (paymentState.paymentType === 2) {
    return creditCardFromShoppingRequest || defaultCreditCard
  } else if (paymentState.paymentType === 3) {
    return procurementCardFromShoppingRequest || defaultProcurementCard
  }
}

const storePaymentInfoForCardScreening = (propsForCardScreening) => {
  const checkoutForCardScreening = getSessionStorage(CARD_SCREEN_INFO)

  let paymentPropsForCardScreening = {
    ...propsForCardScreening,
  }

  if (checkoutForCardScreening) {
    paymentPropsForCardScreening = {
      ...checkoutForCardScreening,
      ...paymentPropsForCardScreening,
    }
  }
  setSessionStorage(CARD_SCREEN_INFO, paymentPropsForCardScreening)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(connectToLocale(Review))
