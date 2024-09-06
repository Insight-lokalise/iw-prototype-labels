import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { FormSection, reduxForm } from 'redux-form'
import Select from 'react-select'
import { t } from '@insight/toolkit-utils/lib/labels'
import { PaymetricDeviceFingerprint } from '@insight/toolkit-react/lib/Paymetric/PaymetricDeviceFingerprint'
import { PaymetricInit } from '@insight/toolkit-react/lib/Paymetric/PaymetricInit'
import {
  getRegion,
  getCountryCode,
} from '@insight/toolkit-utils/lib/helpers/localeHelpers'

import { IWLoading, msgBox } from '../../../../libs/iw-components'
import { IWTextField } from '../../../../libs/iw-components/iw-form'
import { IWSetAsMyDefault } from '../../../../libs/iw-components/iw-setAsMyDefault'
import ScrollToTop from '../../../../libs/routes/ScrollToTop'
import { PaymentInfoReadOnlyView, SelectedPaymentCardView } from './PaymentSFCs'
import { StoredCards } from './StoredCards/StoredCards'
import CreditCardMessage from '../../../messages/CreditCardMessage'
import PaymentModal from './PaymentModal'
import AddNewCardPM from './AddNewCardPM'
// import { INSIGHT_LOCALE_COOKIE_NAME } from '../../../libs/constants'
import {
  fetchWebRefNumber,
  fetchIsoCodes,
} from '../../../../libs/models/Payments/payment'

const safeGet = (o, p) => {
  if (o === undefined || o === null) return null

  let props = p.constructor === Array ? p : p.split('.')
  const propName = props[0]
  const newObj = o[propName]

  if (props.length > 1) {
    props = props.splice(1)
    return safeGet(newObj, props)
  } else {
    return newObj
  }
}

export class PaymentInfoView extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    if (
      !this.props.paymentState.initialized &&
      !this.props.paymentState.isoCodes &&
      this.props.billing &&
      this.props.shipping
    ) {
      const enableCardScreening = this.props.featureFlags['GNA-9004-CS']

      Promise.all([
        this.props.getPaymentFromShoppingRequest(),
        this.props.fetchPopulateUIFlags(),
        this.props.fetchPaymentMethods(),
        enableCardScreening ? fetchWebRefNumber() : Promise.resolve(0),
        enableCardScreening
          ? fetchIsoCodes({
            countryCodes: [
              this.props.billing?.address?.countryId,
              this.props.shipping?.address?.countryId,
            ],
            currencyCodes: [this.props.soldTo?.currency],
          })
          : Promise.resolve(null),
      ])
        .then(
          ([
            payment,
            UIFlags,
            availablePaymentMethods,
            webRefNumber,
            isoCodes,
          ]) => {
            const selectedPaymentType =
              payment.value && Object.keys(payment.value).length > 1
                ? Number(payment.value.type)
                : this.props.defaultPaymentMethod.paymentMethodId
            this.props.setPaymentState({
              isPending: false,
              paymentType: selectedPaymentType,
              webRefNumber,
              isoCodes,
            })

            if (!selectedPaymentType) {
              msgBox.addMsg('shopping-cart', {
                text: t(
                  'Sorry, we are unable to proceed ' +
                  'with this order, as all payment options have been disabled for your account. ' +
                  'Please contact your administrator or account rep to resolve the issue.'
                ),
                severity: 'error',
                scrollTo: '.SBP__messages',
              })
            } else {
              /* scroll to top since it is the top section */
              ScrollToTop()
            }
          }
        )
        .catch((e) => {
          msgBox.addMsg('shopping-cart', {
            text: t(
              'An unexpected error occurred. Please contact your Account Executive for more information.'
            ),
            severity: 'error',
            scrollTo: '.SBP__messages',
          })
        })
      if (this.props.hasStoredCardAccess) {
        this.props.fetchStoredCards()
      }

      //track initialziation so it is only called once
      this.props.setPaymentState({
        initialized: true,
      })
    }
  }

  handlePaymentMethodSelection = ({ value }) => {
    this.props.setPaymentState({
      paymentType: value,
      isProcurementCard: value === 3,
      isPaymetricReady: true,
      requireCardInfo: false,
    })
    msgBox.clear('shopping-cart')
  }

  handleUpdateExpiredCard = () => {
    const { paymentState } = this.props
    this.props.toggleCardEditable(
      this.props.getCardToUse(this.props).storedCardId,
      paymentState.paymentType,
      true
    )
    this.props.setPaymentState({ openStoredCardsModal: true }, () => {
      /**
       * This fixes CR 8531
       * The ideal fix would be to migrate the show[hide]StoredCardsDialog methods of the StoredCards child
       * to this component instead of having display bool logic in both parent and child.
       */
      this.props.setPaymentState({ openStoredCardsModal: false })
    })
  }

  toggleAddNewCard = () => {
    this.props.setPaymentState({
      inAddCardView: !this.props.paymentState.inAddCardView,
      isPaymetricReady: true,
      requireCardInfo: false,
    })
    msgBox.clear('shopping-cart')
    this.props.paymentFormInitialize('AddPaymentOrNewCardForm', {}) // to clear form
  }

  hidePaymentModal = () => {
    this.props.setPaymentState({
      openPaymentModal: false,
      openStoredCardsModal: false,
    })
  }

  hideStoredCardsModal = () => {
    this.props.setPaymentState({ openStoredCardsModal: false })
  }

  showStoredCardsModal = () => {
    this.props.setPaymentState({ openStoredCardsModal: true })
  }

  updateCardToUse = (cardToUse) => {
    this.props.setPaymentState({ inAddCardView: false })
    if (this.props.paymentState.paymentType === 2) {
      this.props.updateSelectedCreditCard(cardToUse)
    } else {
      this.props.updateSelectedProcurementCard(cardToUse)
    }
  }

  render() {
    const storedCards =
      this.props.paymentState.paymentType === 2
        ? this.props.storedCreditCards
        : this.props.storedProcurementCards
    const cardToUse = this.props.getCardToUse(this.props)
    const isAddNewCardVisible =
      this.props.paymentState.inAddCardView || !cardToUse
    const isSelectedCardVisible =
      !this.props.paymentState.inAddCardView && cardToUse
    const {
      availablePaymentMethods = [],
      isLimitedUser,
      isEditChkoutDefaultFavs,
    } = this.props
    const loginAsStoredCardMsg = t(
      'Stored cards are not available to "Login As" users'
    )
    const cloudPaymentMsg = t(
      'Reminder:This card will be used for recurring subscription charges. You can specify different payment information at a later date by contacting us.'
    )
    const allowSetAsMyDefault = !isLimitedUser && isEditChkoutDefaultFavs
    const normalizedPaymentMethods =
      availablePaymentMethods &&
      availablePaymentMethods.map(({ paymentMethodId }) => ({
        label:
          (paymentMethodId === 1 && t('Terms')) ||
          (paymentMethodId === 2 && t('Credit card')) ||
          t('Procurement card'),
        value: paymentMethodId,
      }))
    const paymentMethodId = this.props.paymentState.paymentType
    const defaultPaymentMethodForSetAsDefault = this.props.defaultPaymentMethod
      .isDefault
      ? this.props.defaultPaymentMethod.paymentMethodId
      : ''
    const isPONumberRequired =
      this.props.isPONumberRequired ||
      (this.props.isCES && paymentMethodId === 1)
    const loadAddCardPM = paymentMethodId === 3 || paymentMethodId === 2
    const enableCardScreening = this.props.featureFlags['GNA-9004-CS']

    return this.props.paymentState.isPending ? (
      <IWLoading modal={false} className="iw-loading__size-giant"></IWLoading>
    ) : this.props.isReadOnly ? (
      <section>
        {this.props.selectedPaymentFromShoppingRequest && (
          <PaymentInfoReadOnlyView
            selectedPayment={this.props.selectedPaymentFromShoppingRequest}
            hasPOFields={this.props.hasPOFields}
            isSupressPOReleaseNumber={this.props.isSupressPOReleaseNumber}
          />
        )}
      </section>
    ) : (
      <section ref={this.props.reference}>
        {this.props.paymentState.paymentType !== 1 && (
          <div>
            {this.props.isLoginAs && (
              <div className="row expanded is-collapse-child">
                <div className="column">
                  <p className="payment-info--loginas__warning">
                    {loginAsStoredCardMsg}
                  </p>
                </div>
              </div>
            )}
            {this.props.isCloudCart && (
              <div className="row expanded is-collapse-child">
                <div className="column">
                  <p className="payment-info--loginas__warning">
                    {cloudPaymentMsg}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <form className="form" onSubmit={this.props.handleSubmit}>
          <div className="row expanded is-collapse-child">
            <div className="column">
              {this.props.paymentState.paymentType !== 1 && !this.props.isEMEA && (
                <div className="float--right">
                  {storedCards.length > 0 && (
                    <span>
                      <StoredCards
                        paymentType={this.props.paymentState.paymentType}
                        storedCards={storedCards}
                        defaultCardId={
                          (cardToUse && cardToUse.storedCardId) || 0
                        }
                        onDeleteCard={this.props.deleteCard}
                        onToggleCardEditable={(cardId) =>
                          this.props.toggleCardEditable(
                            cardId,
                            this.props.paymentState.paymentType
                          )
                        }
                        updateCard={this.props.updateCard}
                        openStoredCardsModal={
                          this.props.paymentState.openStoredCardsModal
                        }
                        updateCardToUse={this.updateCardToUse}
                        hideStoredCardsModal={this.hideStoredCardsModal}
                        showStoredCardsModal={this.showStoredCardsModal}
                        isEMEA={this.props.isEMEA}
                        isRequisition={this.props.isRequisition}
                        isCyberSource={this.props.isCyberSource}
                        billing={this.props.billing}
                        salesOrg={this.props.salesOrg}
                        currencyCode={this.props.soldTo?.currency}
                      />
                      <span className="vertical-separator">|</span>
                    </span>
                  )}
                  {(storedCards.length > 0 ||
                    (storedCards.length === 0 && cardToUse)) && (
                      <a
                        className="section__body-action"
                        onClick={this.toggleAddNewCard}
                      >
                        {this.props.paymentState.inAddCardView
                          ? t('Cancel')
                          : t('Add new')}
                      </a>
                    )}
                </div>
              )}
              <div className={'row expanded collapse align-middle'}>
                <div className="column small-12 medium-4">
                  <IWSetAsMyDefault
                    className="edit-payment-method"
                    clearSetAsMyDefault={(fieldName) =>
                      this.props.clearSetAsMyDefault(
                        'AddPaymentOrNewCardForm',
                        fieldName,
                        false
                      )
                    }
                    defaultValue={'' + defaultPaymentMethodForSetAsDefault}
                    fieldPosition={'bottom'}
                    name={'payment-method__samd'}
                    show={allowSetAsMyDefault}
                    value={'' + this.props.paymentState.paymentType}
                  >
                    <label
                      htmlFor="Select__Payment-method"
                      className="form__label"
                    >
                      {t('Payment method')}
                    </label>
                    <Select
                      className="Select__Payment-method"
                      id={'Select__Payment-method'}
                      value={this.props.paymentState.paymentType}
                      onChange={this.handlePaymentMethodSelection}
                      options={normalizedPaymentMethods}
                      searchable={normalizedPaymentMethods.length > 1}
                      placeholder={t('Select a payment method')}
                      noResultsText={t('Payment methods not found')}
                      clearable={false}
                      autoBlur
                      disabled={normalizedPaymentMethods.length === 0}
                    />
                  </IWSetAsMyDefault>
                </div>
                <CreditCardMessage
                  paymentType={this.props.paymentState.paymentType}
                />
              </div>
            </div>
          </div>
          {!this.props.isCES && (
            <>
              {paymentMethodId === 3 && (
                <FormSection name="procurementFields">
                  <div className="columns small-12 medium-6 large-3">
                    <label className="form__label--readonly">
                      {t('Reporting fields')}
                    </label>
                  </div>
                  <div className="row expanded is-collapse-child">
                    {/* we just need four static fields so looping arond a static array */}
                    {[0, 1, 2, 3].map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="columns small-12 medium-6 large-3"
                        >
                          <IWTextField
                            label={t('Reporting fields')}
                            name={`${item}`}
                            hideLabel
                            maxLength={40}
                          />
                        </div>
                      )
                    })}
                  </div>
                </FormSection>
              )}
              {this.props.hasPOFields && (
                <FormSection name="POSection">
                  <div className="row expanded is-collapse-child">
                    <div className="column small-12 medium-6">
                      {isPONumberRequired ? (
                        <IWTextField
                          label={t('P.O. number')}
                          name="poNumber"
                          maxLength={35}
                          required
                        />
                      ) : (
                        <IWTextField
                          label={t('P.O. number (optional)')}
                          name="poNumber"
                          maxLength={35}
                        />
                      )}
                    </div>
                    {!this.props.isSupressPOReleaseNumber && (
                      <div className="column small-12 medium-6">
                        <IWTextField
                          label={t('P.O. release number (optional)')}
                          name="poReleaseNumber"
                          maxLength={35}
                        />
                      </div>
                    )}
                  </div>
                </FormSection>
              )}
            </>
          )}
          {paymentMethodId === 1 ? (
            <div />
          ) : (
            <div>
              {!this.props.isEMEA && enableCardScreening && (
                <PaymetricInit enable3DS />
              )}
              {/* 
                Disable Device Fingerprint script for phase one since Paymetric does not support it.
                {!this.props.isEMEA &&
                // trigger 3DS2 if user is not a requestor or loginAs user, and backend enbles it with supported currency
                !this.props.isLoginAs &&
                !this.props.isRequisition &&
                this.props.isCyberSource &&
                enableCardScreening && (
                  <PaymetricDeviceFingerprint
                    webReferenceNumber={this.props.paymentState.webRefNumber}
                    countryCode={getCountryCode(INSIGHT_LOCALE_COOKIE_NAME)}
                    region={getRegion(INSIGHT_LOCALE_COOKIE_NAME)}
                    isIPS={this.props.ipsUser}
                  />
                )} */}
              {isAddNewCardVisible && !this.props.isEMEA && loadAddCardPM && (
                <AddNewCardPM
                  availableCardTypes={this.props.availableCardTypes}
                  canSaveCard={this.props.hasStoredCardAccess}
                  setPaymentState={this.props.setPaymentState}
                  addToStoredCards={this.props.paymentState.addToStoredCards}
                  isDefaultCard={this.props.paymentState.isDefaultCard}
                  isPaymetricReady={this.props.isPaymetricReady}
                  isPaymentRequired={this.props.isPaymentRequired}
                  isProcurementCard={this.props.paymentState.isProcurementCard}
                  locale={this.props.locale}
                  resultCallback={(data) =>
                    this.props.payMetricCallback(data, this.props)
                  }
                  storedCardDesc={this.props.paymentState.storedCardDesc}
                  requireCardInfo={this.props.paymentState.requireCardInfo}
                  featureFlags={this.props.featureFlags}
                  currencyCode={this.props.soldTo?.currency}
                  totalCost={this.props.cartSummary?.totalCost}
                  userContact={this.props.orderMetaData?.userContact}
                  billing={this.props.billing}
                  shipping={this.props.shipping}
                  webRefNumber={this.props.paymentState.webRefNumber}
                  isoCodes={this.props.paymentState.isoCodes}
                  isRequisition={this.props.isRequisition}
                  isCyberSource={this.props.isCyberSource}
                  isLoginAs={this.props.isLoginAs}
                  taxIsPending={this.props.taxIsPending}
                />
              )}

              {isSelectedCardVisible && !this.props.isEMEA && (
                <IWSetAsMyDefault
                  className="edit-payment-card"
                  clearSetAsMyDefault={(fieldName) =>
                    this.props.clearSetAsMyDefault(
                      'AddPaymentOrNewCardForm',
                      fieldName,
                      false
                    )
                  }
                  defaultValue={
                    '' +
                    (safeGet(
                      this.props,
                      paymentMethodId === 2
                        ? 'defaultCreditCard.storedCardId'
                        : 'defaultProcurementCard.storedCardId'
                    ) || 'none')
                  }
                  name={'payment-card__samd'}
                  show={allowSetAsMyDefault}
                  value={'' + (safeGet(cardToUse, 'storedCardId') || '')}
                >
                  <SelectedPaymentCardView
                    selectedCard={cardToUse}
                    onUpdateExpiredCard={this.handleUpdateExpiredCard}
                    resultCallback={(data) =>
                      this.props.payMetricCallback(data, this.props)
                    }
                    billing={this.props.billing}
                    shipping={this.props.shipping}
                    userContact={this.props.orderMetaData?.userContact}
                    currencyCode={this.props.soldTo?.currency}
                    webRefNumber={this.props.paymentState.webRefNumber}
                    isoCodes={this.props.paymentState.isoCodes}
                    locale={this.props.locale}
                    totalCost={this.props.cartSummary?.totalCost}
                    isRequisition={this.props.isRequisition}
                    isCyberSource={this.props.isCyberSource}
                    isLoginAs={this.props.isLoginAs}
                    setPaymentState={this.props.setPaymentState}
                    featureFlags={this.props.featureFlags}
                    taxIsPending={this.props.taxIsPending}
                  />
                </IWSetAsMyDefault>
              )}
            </div>
          )}
          {this.props.isCES && (
            <>
              {paymentMethodId === 3 && (
                <FormSection name="procurementFields">
                  <div className="columns small-12 medium-6 large-3">
                    <label className="form__label--readonly">
                      {t('Reporting fields')}
                    </label>
                  </div>
                  <div className="row expanded is-collapse-child">
                    {/* we just need four static fields so looping arond a static array */}
                    {[0, 1, 2, 3].map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="columns small-12 medium-6 large-3"
                        >
                          <IWTextField
                            label={t('Reporting fields')}
                            name={`${item}`}
                            hideLabel
                            maxLength={40}
                          />
                        </div>
                      )
                    })}
                  </div>
                </FormSection>
              )}
              {this.props.hasPOFields && (
                <FormSection name="POSection">
                  <div className="row expanded is-collapse-child">
                    <div className="column small-12 medium-6">
                      <IWTextField
                        label={t(
                          isPONumberRequired
                            ? 'P.O. number'
                            : 'P.O. number (optional)'
                        )}
                        name="poNumber"
                        maxLength={35}
                        required={isPONumberRequired}
                      />
                    </div>
                    {!this.props.isSupressPOReleaseNumber && (
                      <div className="column small-12 medium-6">
                        <IWTextField
                          label={t('P.O. release number (optional)')}
                          name="poReleaseNumber"
                          maxLength={35}
                        />
                      </div>
                    )}
                  </div>
                </FormSection>
              )}
            </>
          )}
        </form>
        {this.props.isEMEA && paymentMethodId != 1 && (
          <PaymentModal
            cardToUse={cardToUse}
            defaultCardId={
              safeGet(
                this.props,
                paymentMethodId === 2
                  ? 'defaultCreditCard.storedCardId'
                  : 'defaultProcurementCard.storedCardId'
              ) || 0
            }
            selectedCardId={(cardToUse && cardToUse.storedCardId) || 0}
            hasStoredCardAccess={this.props.hasStoredCardAccess}
            inAddCardView={this.props.paymentState.inAddCardView}
            isAddNewCardVisible={isAddNewCardVisible}
            isDefaultCard={this.props.paymentState.isDefaultCard}
            isEMEA={this.props.isEMEA}
            isSelectedCardVisible={!!isSelectedCardVisible}
            locale={this.props.locale}
            onHide={this.hidePaymentModal}
            onDeleteCard={this.props.deleteCard}
            onToggleCardEditable={(cardId) =>
              this.props.toggleCardEditable(
                cardId,
                this.props.paymentState.paymentType
              )
            }
            openPaymentModal={this.props.paymentState.openPaymentModal}
            setPaymentState={this.props.setPaymentState}
            resultCallback={(data) =>
              this.props.worldPayResultCallback(data, this.props)
            }
            showAddNewCardLink={
              storedCards.length > 0 || (storedCards.length === 0 && cardToUse)
            }
            storedCardDesc={this.props.paymentState.storedCardDesc}
            openStoredCardsModal={this.props.paymentState.openStoredCardsModal}
            storedCards={storedCards}
            toggleAddNewCard={this.toggleAddNewCard}
            updateCard={(card) =>
              this.props.updateCard(card, this.props.isEMEA)
            }
            updateCardToUse={this.updateCardToUse}
            onUpdateExpiredCard={this.handleUpdateExpiredCard}
          />
        )}
      </section>
    )
  }
}

export default reduxForm({
  destroyOnUnmount: true,
  enableReinitialize: true,
  form: 'AddPaymentOrNewCardForm',
  keepDirtyOnReinitialize: true,
  pure: true,
})(PaymentInfoView)

PaymentInfoView.defaultProps = {
  isEditChkoutDefaultFavs: false,
  isLimitedUser: false,
  isQuickCheckout: false,
}

PaymentInfoView.propTypes = {
  availablePaymentMethods: PropTypes.array,
  isEditChkoutDefaultFavs: PropTypes.bool.isRequired,
  isLimitedUser: PropTypes.bool.isRequired,
  isRequisition: PropTypes.bool.isRequired,
  isCyberSource: PropTypes.bool.isRequired,
  isQuickCheckout: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  validateReviewOrder: PropTypes.func.isRequired,
  isPaymetricReady: PropTypes.bool.isRequired,
  featureFlags: PropTypes.bool.isRequired,
  soldTo: PropTypes.object.isRequired,
  cartSummary: PropTypes.object.isRequired,
  orderMetaData: PropTypes.object.isRequired,
  billing: PropTypes.object.isRequired,
  shipping: PropTypes.object.isRequired,
  paymentState: PropTypes.object.isRequired,
  ipsUser: PropTypes.bool.isRequired,
  isLoginAs: PropTypes.bool.isRequired,
  taxIsPending: PropTypes.bool.isRequired,
  salesOrg: PropTypes.string.isRequired,
}
