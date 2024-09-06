import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Component } from 'react'

import { getCurrentLocale } from '@insight/toolkit-utils'
import { sendSignal } from 'app-api-user-service'
import ROUTES from '../../../../libs/routes'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor, IWButton } from '../../../../libs/iw-components'
import { getShoppingRequest } from '../../../../libs/ShoppingRequest/actions'
import { placeOrder, termsAndConditions } from '../../actions/placeOrderActions'
import { checkoutGAE, receiptGAE } from '@insight/toolkit-utils/lib/analytics'
import { currentLocale } from '../../../../libs/models/User/locale'
import {
  selector_taxIsPending,
  selector_shoppingRequestCartItems,
} from '../../../../libs/ShoppingRequest/selectors'
import {
  selector_cdmUid,
  selector_userSalesOrg,
  selector_sessionId,
  selector_country,
} from '../../../../libs/User/selectors'
import { selector_isRequisition } from '../../../LineLevel/selectors'
import {
  selector_cart,
  selector_cartItemsGAE,
  selector_isSavedQuote,
  selector_isOrderTemplate,
} from '../../../../libs/Cart/selectors/cartResponse'
import {
  selector_revisionId,
  selector_termsId,
  selector_termAcceptance,
  selector_isEMEA,
} from '../../../../libs/User/selectors'
import { selector_locale } from '../../../../libs/Insight/selectors'
import {getDigitalDataCheckoutType, selector_isQuickCheckout} from '../../../../libs/Cart/selectors/shoppingCartView'
import { RECEIPT_TITLE } from '../../../../libs/businessContainerApps/checkoutAppHeader/constants'
import TnCModal from './TnCModal'
import { selector_isEnableCreditCardMessage } from '../../../messages/selectors'
import { PURCHASE_CHECKOUT_TYPE } from '../../../libs/constants'

export class PlaceOrderButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disabled: false,
      staticTermsChecked: false,
      showTnCModal: false,
      term: {},
      termsChecked: false,
      tncContent: '',
      termsDisabled: false,
    }
  }

  componentDidMount() {
    const { revisionId, termsId } = this.props
    if (revisionId !== 0 && termsId !== 0) {
      return this.props
        .termsAndConditions(termsId, revisionId)
        .then(({ value }) => {
          this.setState({
            term: value,
            tncContent: value.content,
          })
        })
    }
  }

  handlePlaceOrderClick() {
    this.props.disable_feature_payment
      ? this.submitPlaceOrder()
      : this.props.handlePlaceOrder()
  }

  disablePlaceOrderButton() {
    this.setState({ termsDisabled: true, disabled: true })
  }

  disableTermsCheckbox() {
    this.setState({ termsDisabled: true })
  }

  enablePlaceOrderButton() {
    this.setState({ disabled: false })
  }

  signalRequest() {
    const locale = getCurrentLocale('insight_locale')
    const { cdmUid, country, salesOrg, sessionId, shoppingCartItems } =
      this.props
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

  submitPlaceOrder(webRefNumber) {
    this.disablePlaceOrderButton()
    const isSavedQuote = this.props.isSavedQuote
    const isOrderTemplate = this.props.isOrderTemplate
    const isQuickCheckout = this.props.isQuickCheckout
    const isPurchaseAnalyticFlagEnabled = window.flags && window.flags['GNA-12643-PURCHASE-ANALYTICS']
    const checkoutType = (this.props.isRequisition && isPurchaseAnalyticFlagEnabled) ? PURCHASE_CHECKOUT_TYPE.REQUISITION_REQUESTED :
      this.props.digitalDataCheckoutType === PURCHASE_CHECKOUT_TYPE.CHECKOUT ? PURCHASE_CHECKOUT_TYPE.CHECKOUT : PURCHASE_CHECKOUT_TYPE.QUICK_CHECKOUT
    checkoutGAE({
      step: 5,
      cart: this.props.cart,
      cartItems: this.props.cartItemsGAE,
      isSaveAsQuote: this.props.isSavedQuote,
      isOrderTemplate: this.props.isOrderTemplate,
      isQuickCheckout: this.props.isQuickCheckout,
      overridePageTitle: RECEIPT_TITLE,
    })
    return this.props
      .getShoppingRequest()
      .then(({ value: shoppingRequest }) => {
        this.props
          .placeOrder({ webReferenceNumber: webRefNumber || 0 })
          .then(({ value }) => {
            this.signalRequest()
            let { redirectUrl } = value
            let confirmOrderCallback = null
            if (!!redirectUrl) {
              if (this.props.isEnableCreditCardMessage) {
                const paramDelimiter = redirectUrl.indexOf('?') > -1 ? '&' : '?'
                redirectUrl = `${redirectUrl}${paramDelimiter}info=1`
              }
              confirmOrderCallback = function () {
                document.location = this.confirmOrderUrl
              }.bind({ confirmOrderUrl: redirectUrl })
            }
            try {
              let newShoppingRequest = {
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
              console.log(error)
              if (redirectUrl) {
                document.location = redirectUrl
              }
            }

            if (redirectUrl) {
              // If google analytics isn't loaded, we need to switch URLs anyway,
              // but the GAE callback should have already been called.
              if (!window['gaGlobal']) {
                document.location = redirectUrl
              }
            } else {
              this.props.history.push({ pathname: ROUTES.RECEIPT })
            }
          })
          .catch((err) => {
            console.log(err)
            this.enablePlaceOrderButton()
          })
      })
      .catch((err) => {
        console.log(err)
        this.enablePlaceOrderButton()
      })
  }

  /* This default term is only for EMEA */
  agreeDefaultTnC(isChecked) {
    this.setState({
      termsChecked: isChecked,
    })
  }

  /* This static term is onnly for Italy */
  agreeStaticTnC(isChecked) {
    this.setState({
      staticTermsChecked: isChecked,
    })
  }

  openTnCModal = () => {
    this.setState({
      showTnCModal: true,
    })
  }

  hideTnCModal = () => {
    this.setState({
      showTnCModal: false,
    })
  }

  render() {
    const {
      disabled,
      staticTermsChecked,
      showTnCModal,
      term,
      termsChecked,
      tncContent,
    } = this.state
    const {
      isPaymetricReady,
      isPaymentInProgress,
      isRequisition,
      locale,
      taxIsPending,
      termAcceptanceRequired,
      paymentType,
    } = this.props
    let placeOrderText = isRequisition
      ? t('Place requisition')
      : t('Place order')
    if (paymentType != 1 && this.props.isEMEA) {
      placeOrderText = t('Continue to payment')
    }
    const hasSalesAgreement =
      term.salesAgreement && term.salesAgreement.length > 0
    const termsConditions =
      term.default || hasSalesAgreement
        ? t(term.description)
        : t('terms and conditions')
    const isItalian = locale.split('_')[1] === 'IT'
    const isPlaceOrderDisabledTerms = termAcceptanceRequired && !termsChecked
    const isPlaceOrderDisabledLocale = isItalian && !staticTermsChecked
    const isPOButtonDisabledWithXIPAY = !isPaymetricReady
    const isPlaceOrderDisabled =
      (isPlaceOrderDisabledTerms && isPlaceOrderDisabledLocale) ||
      isPlaceOrderDisabledTerms ||
      isPlaceOrderDisabledLocale ||
      isPOButtonDisabledWithXIPAY
    const privacyPolicyURL =
      window.location.origin +
      '/' +
      currentLocale() +
      '/knowledge-base/policies/privacy-statement.html'
    return (
      <div className="row is-collapse-child hide-for-print">
        <div className="columns">
          {termAcceptanceRequired && (
            <div className="cart-agreement">
              <div className="row">
                <div className="columns small-1">
                  <label className="form__label form__label--inline">
                    <input
                      className="form__field form__input--checkbox"
                      type="checkbox"
                      onChange={(event) =>
                        this.agreeDefaultTnC(event.target.checked)
                      }
                      disabled={this.state.termsDisabled}
                    />
                  </label>
                </div>
                <div className="columns shopping-cart__header-title">
                  <span className="cart-agreement__font-size no-margin-bot">
                    {t('By placing this order you agree to the ')}
                    <IWAnchor
                      onClick={this.openTnCModal}
                      className="cart-agreement__link"
                    >
                      {termsConditions}
                    </IWAnchor>{' '}
                    {t(
                      '(or other agreed terms between you and Insight) and our '
                    )}
                    <IWAnchor
                      target="blank"
                      href={privacyPolicyURL}
                      className="cart-agreement__link"
                    >
                      {t('Privacy Policy')}
                    </IWAnchor>
                    .
                  </span>
                  <br />
                </div>
              </div>
              {termAcceptanceRequired && (
                <TnCModal
                  hideTnCModal={this.hideTnCModal}
                  showTnCModal={showTnCModal}
                  termsTitle={termsConditions}
                  tncContent={tncContent}
                />
              )}
            </div>
          )}

          {isItalian && (
            <div className="cart-agreement">
              <div className="row">
                <div className="columns small-1">
                  <label className="form__label form__label--inline">
                    <input
                      className="form__field form__input--checkbox"
                      type="checkbox"
                      onChange={(event) =>
                        this.agreeStaticTnC(event.target.checked)
                      }
                    />
                  </label>
                </div>
                <div className="columns shopping-cart__header-title">
                  <span className="cart-agreement__font-size no-margin-bot">
                    {t(
                      'Under articles 1341 and 1342 of Italian civil code, you hereby declare to have read carefully, and to hereby agree to and accept specifically the following articles of the '
                    )}
                  </span>
                  <IWAnchor
                    onClick={this.openTnCModal}
                    className="cart-agreement__link"
                  >
                    {termsConditions}
                  </IWAnchor>
                  <span className="cart-agreement__font-size no-margin-bot">
                    {t('Articolo 3  “Contratto vincolante”;')}
                    {t('Articolo 4. “Prodotti e Servizi”;')}
                    {t('Articolo 5  “Prezzi e pagamento”;')}
                    {t('Articolo 6. “Trasporto e Consegna”;')}
                    {t('Articolo 7. “Restituzioni”;')}
                    {t('Articolo 8. “Garanzia”;')}
                    {t('Articolo 9. “Limitazione di Responsabilità”;')}
                    {t(
                      'Articolo 10.(10.1, 102,10.3,10.4, 10,5) "Risoluzione e cessazione degli effetti del Contratto";'
                    )}
                    {t(
                      'Articolo 11 "Informazioni riservate e tutela dei dati personali";'
                    )}
                    {t('Articolo 12. "Restrizioni sulla Esportazione";')}
                    {t(
                      'Articolo 14.1. "Informazioni generali – Intero Accordo”.'
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
          <IWButton
            className="expanded cart-summary__button"
            onClick={() => this.handlePlaceOrderClick()}
            disabled={
              taxIsPending ||
              disabled ||
              isPlaceOrderDisabled ||
              isPaymentInProgress
            }
          >
            {placeOrderText}
          </IWButton>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    cart: selector_cart(state),
    cdmUid: selector_cdmUid(state),
    country: selector_country(state),
    digitalDataCheckoutType: getDigitalDataCheckoutType(state),
    sessionId: selector_sessionId(state),
    shoppingCartItems: selector_shoppingRequestCartItems(state),
    cartItemsGAE: selector_cartItemsGAE(state),
    isEMEA: selector_isEMEA(state),
    isRequisition: selector_isRequisition(state),
    isSavedQuote: selector_isSavedQuote(state),
    isOrderTemplate: selector_isOrderTemplate(state),
    isQuickCheckout: selector_isQuickCheckout(state),
    locale: selector_locale(state),
    revisionId: selector_revisionId(state),
    salesOrg: selector_userSalesOrg(state),
    termAcceptanceRequired: selector_termAcceptance(state),
    termsId: selector_termsId(state),
    taxIsPending: selector_taxIsPending(state),
    isEnableCreditCardMessage: selector_isEnableCreditCardMessage(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getShoppingRequest,
      placeOrder,
      termsAndConditions,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(PlaceOrderButton)
