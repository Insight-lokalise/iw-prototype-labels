import creditCardType from 'credit-card-type'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import {
    FormSection,
    reduxForm,
} from 'redux-form'
import Select from 'react-select'
import { t } from '@insight/toolkit-utils/lib/labels'

import {
    IWButton,
    IWLoading,
    msgBox,
} from '../../../../libs/iw-components'
import { IWTextField } from '../../../../libs/iw-components/iw-form'
import { IWSetAsMyDefault } from '../../../../libs/iw-components/iw-setAsMyDefault'
import { paymentOptionsGAE } from '@insight/toolkit-utils/lib/analytics'

import ROUTES from '../../../../libs/routes'
import { navigateToSection } from '../../../../libs/routes/navigate'
import ScrollIntoView from '../../../../libs/routes/ScrollIntoView'

import { cardTypes } from '../../constants'
import { checkExpired } from './paymentInfoHelpers'
import {
    PaymentInfoReadOnlyView,
    SelectedPaymentCardView,
} from './PaymentSFCs'
import { AddNewCard } from './AddNewCard'
import { StoredCards } from './StoredCards/StoredCards'
import CreditCardMessage from "../../../messages/CreditCardMessage"

const safeGet = (o, p) => {
    if (o === undefined || o === null) return null

    let props = (p.constructor === Array) ? p : p.split('.')
    const propName = props[0]
    const newObj = o[propName]

    if (props.length > 1) {
        props = props.splice(1);
        return safeGet(newObj, props);
    } else {
        return newObj;
    }
}

export class PaymentInfoView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inAddCardView: false,
            paymentType: 1,
            openStoredCardsModal: false,
            overrideTax: false,
            isPending: true,
        }
    }

    componentDidMount() {
        Promise.all([
            this.props.getPaymentFromShoppingRequest(),
            this.props.fetchPopulateUIFlags(),
            this.props.getTaxExemptFromShoppingRequest(),
            this.props.fetchPaymentMethods(),
        ]).then(([payment, UIFlags, taxExemption, availablePaymentMethods]) => {
            const selectedPaymentType = payment.value && Object.keys(payment.value).length > 1 ? Number(payment.value.type) : this.props.defaultPaymentMethod.paymentMethodId
            this.setState({
                overrideTax: this.props.hasTaxOverride && taxExemption.value !== null && taxExemption.value.applyTaxCertificate,
                isPending: false,
                paymentType: selectedPaymentType,
            })

            /* scroll into view when component finished loading */
            if (!this.props.isReadOnly && !this.props.isCollapsed) {
                const thisComponent = ReactDOM.findDOMNode(this);
                thisComponent && ScrollIntoView(thisComponent, -200)
            }
        })
        if (this.props.hasStoredCardAccess) {
            this.props.fetchStoredCards()
        }
    }

    getCardToUse = () => {
        const {
            defaultCreditCard,
            defaultProcurementCard,
            creditCardFromShoppingRequest,
            procurementCardFromShoppingRequest,
        } = this.props
        if (this.state.paymentType === 2) {
            return creditCardFromShoppingRequest || defaultCreditCard
        } else if (this.state.paymentType === 3) {
            return procurementCardFromShoppingRequest || defaultProcurementCard
        }
    };

    handleAddCardFormSubmit = values => {

        const { POSection, procurementFields = [] } = values
        const billingRequest = {
            type: this.state.paymentType,
            option: this.props.availablePaymentMethodsMap[this.state.paymentType].paymentOptionTerms,
            ...POSection,
            procurementFields: this.state.paymentType === 3 ? procurementFields : null,
        }
        const cardToUse = this.getCardToUse() // incase of not new card
        if (this.state.paymentType === 1) {
            this.updatePaymentToShoppingRequest({ ...billingRequest })
        } else if (this.state.inAddCardView || !cardToUse) {
            // create credit card or proc card
            // we need this as we dont want to mutate values object from redux form
            const cardInfo = { ...values.cardInfo }
            if (!this.props.isPaymentRequired && Object.keys(cardInfo).length === 0) {
                // no need to create card, submit payment
                this.updatePaymentToShoppingRequest({ ...billingRequest })
                return false
            }
            // need to remove this as this key as it is not accepted by backend
            // by not mutating, we are not effecting form fields by removing this key
            delete cardInfo.addToStoredCards
            const storedCardType = cardTypes[creditCardType(cardInfo.storedCardToken)[0].type]
            this.props.createCard({ ...cardInfo, storedCardType, storedCardMethodId: this.state.paymentType })
                .then(({ value }) => {
                    // once card created, update payment to Shopping request
                    if (value.exceptionExists &&
                        value.exceptionsList &&
                        Array.isArray(value.exceptionsList) &&
                        value.exceptionsList.includes('INVALID_CARD')
                    ) {
                        msgBox.addMsg('SBP-header', {
                            text: value.exceptionsList.join(', '),
                            severity: 'error',
                            scrollTo: '.SBP__messages',
                        })
                    } else {
                        msgBox.clear('SBP-header')
                        this.updatePaymentToShoppingRequest({
                            ...billingRequest,
                            cardInfo: transformStoredCardToCardInfo(value),
                        })
                    }
                })
        } else {
            // use provided card
            const isExpired = checkExpired(cardToUse.storedCardExpMonth, cardToUse.storedCardExpYear)
            if (isExpired) return false
            this.updatePaymentToShoppingRequest({
                ...billingRequest,
                cardInfo: transformStoredCardToCardInfo(cardToUse),
            })
            if (values["payment-card__samd"]) {
                this.props.updatePaymentCardDefault(cardToUse.storedCardMethodId, cardToUse.storedCardId);
            }
        }
        if (values["payment-method__samd"]) {
            this.props.updatePaymentMethodDefault(this.state.paymentType);
        }
    };

    handlePaymentMethodSelection = ({ value }) => {
        this.setState({ paymentType: value })
    };

    handleUpdateExpiredCard = () => {

        this.props.toggleCardEditable(this.props.defaultCreditCard.storedCardId, this.state.paymentType, true)
        this.setState({ openStoredCardsModal: true }, () => {
            /**
             * This fixes CR 8531
             * The ideal fix would be to migrate the show[hide]StoredCardsDialog methods of the StoredCards child
             * to this component instead of having display bool logic in both parent and child.
             */
            this.setState({ openStoredCardsModal: false })
        })
    };

    toggleAddNewCard = () => {
        this.setState({ inAddCardView: !this.state.inAddCardView })
        this.props.paymentFormInitialize('AddPaymentOrNewCardForm', {}) // to clear form
    };

    updateCardToUse = cardToUse => {
        if (this.state.paymentType === 2) {
            this.props.updateSelectedCreditCard(cardToUse)
        } else {
            this.props.updateSelectedProcurementCard(cardToUse)
        }
    };

    updatePaymentToShoppingRequest = billingRequest => {
        const taxExemptionPayload = {
            number: this.props.taxExemptionNumber,
            applyTaxCertificate: this.state.overrideTax,
        }
        Promise.all([
            this.props.updatePayment(billingRequest),
            this.props.hasTaxOverride ? this.props.updateTaxExemption(taxExemptionPayload) : null,
        ])
            .then(this.props.validateReviewOrder)
            .then(({ value }) => {
                paymentOptionsGAE(3, billingRequest)
                if (value.length > 0) {
                    msgBox.addMsg('SBP-header', {
                        text: t('Errors must be corrected before saving.'),
                        severity: 'error',
                        scrollTo: '.SBP__messages',
                    })
                } else {
                    if (this.props.hasTaxOverride && this.props.taxExemptionNumber && !this.props.isQuickCheckout) {
                        this.props.getTaxAndEWRFee().then(() => {
                            this.props.proceedToCheckout({ source: 'PAYMENT' })
                                .then(({ value }) => {
                                    const { checkoutState } = value
                                    navigateToSection(this.props.history, checkoutState, this.props.setActiveIndex)
                                })
                        })
                    } else {
                        msgBox.clear('SBP-header')

                        if (this.props.isB2BUser) {
                            const pathname = ROUTES.CART_TRANSFER
                            this.props.history.push({ pathname })
                            this.props.setActiveIndex('SBP', 0)
                            this.props.setActiveIndex('LineLevel', 0)
                        } else {
                            this.props.proceedToCheckout({ source: 'PAYMENT' })
                                .then(({ value }) => {
                                    const { checkoutState } = value
                                    navigateToSection(this.props.history, checkoutState, this.props.setActiveIndex)
                                })
                        }
                    }
                }
            })
    };

    render() {
        const storedCards = this.state.paymentType === 2 ? this.props.storedCreditCards : this.props.storedProcurementCards
        const continueText = this.props.isRequisition ? t('Review requisition') : t('Review order')
        const cardToUse = this.getCardToUse()
        const isAddNewCardVisible = (this.state.inAddCardView || !cardToUse)
        const isSelectedCardVisible = !this.state.inAddCardView && cardToUse
        const {
            availablePaymentMethods = [],
            isLimitedUser,
            isEditChkoutDefaultFavs
        } = this.props
        const loginAsStoredCardMsg = t('Stored cards are not available to "Login As" users')
        const cloudPaymentMsg = t('Reminder:This card will be used for recurring subscription charges. You can specify different payment information at a later date by contacting us.')
        const allowSetAsMyDefault = !isLimitedUser && isEditChkoutDefaultFavs
        const normalizedPaymentMethods = availablePaymentMethods &&
            availablePaymentMethods.map(({ paymentMethodId }) => ({
                label:
                    (paymentMethodId === 1 && t('Terms')) ||
                    (paymentMethodId === 2 && t('Credit card')) ||
                    t('Procurement card'),
                value: paymentMethodId,
            }))
        const paymentMethodId = this.state.paymentType
        const defaultPaymentMethodForSetAsDefault = this.props.defaultPaymentMethod.isDefault ? this.props.defaultPaymentMethod.paymentMethodId : ''
        const isPONumberRequired = this.props.isPONumberRequired
        return (
            this.state.isPending ? <IWLoading modal={false} className="iw-loading__size-giant"></IWLoading> : (this.props.isReadOnly ?
                <section>
                    {this.props.selectedPaymentFromShoppingRequest &&
                        <PaymentInfoReadOnlyView
                            selectedPayment={this.props.selectedPaymentFromShoppingRequest}
                            hasPOFields={this.props.hasPOFields}
                            isSupressPOReleaseNumber={this.props.isSupressPOReleaseNumber}
                        />
                    }
                </section>
                :
                <section>
                    {this.state.paymentType !== 1 &&
                        <div>
                            {this.props.isLoginAs &&
                                <div className="row expanded is-collapse-child">
                                    <div className="column">
                                        <p className="payment-info--loginas__warning">{loginAsStoredCardMsg}</p>
                                    </div>
                                </div>
                            }
                            {this.props.isCloudCart &&
                                <div className="row expanded is-collapse-child">
                                    <div className="column">
                                        <p className="payment-info--loginas__warning">{cloudPaymentMsg}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                    <form className="form" onSubmit={this.props.handleSubmit(this.handleAddCardFormSubmit)}>
                        <div className="row expanded is-collapse-child">
                            <div className="column">
                                {this.state.paymentType !== 1 &&
                                    <div className="float--right">
                                        {storedCards.length > 0 &&
                                            <span>
                                                <StoredCards
                                                    paymentType={this.state.paymentType}
                                                    storedCards={storedCards}
                                                    defaultCardId={(cardToUse && cardToUse.storedCardId) || 0}
                                                    onDeleteCard={this.props.deleteCard}
                                                    onToggleCardEditable={cardId => this.props.toggleCardEditable(cardId, this.state.paymentType)}
                                                    updateCard={this.props.updateCard}
                                                    openStoredCardsModal={this.state.openStoredCardsModal}
                                                    updateCardToUse={this.updateCardToUse}
                                                />
                                                <span className="vertical-separator">|</span>
                                            </span>
                                        }
                                        {(storedCards.length > 0 || (storedCards.length === 0 && cardToUse)) &&
                                            <a className="section__body-action" onClick={this.toggleAddNewCard}>{this.state.inAddCardView ? t('Cancel') : t('Add new')}</a>
                                        }
                                    </div>
                                }
                                <h1 className={'fieldset__heading'}>{t('Payment method')}</h1>
                                <div className={'row expanded collapse row__gutter--tiny align-middle'}>
                                    <div className='column small-12 medium-12 large-12'>
                                        <label className='form__label'>
                                            {t('Select a specific payment method from the list below')}:
                                        </label>
                                    </div>
                                    <div className="column small-12 medium-4">
                                        <IWSetAsMyDefault className="edit-payment-method"
                                            clearSetAsMyDefault={fieldName => this.props.clearSetAsMyDefault('AddPaymentOrNewCardForm', fieldName, false)}
                                            defaultValue={'' + defaultPaymentMethodForSetAsDefault}
                                            fieldPosition={'bottom'}
                                            name={'payment-method__samd'}
                                            show={allowSetAsMyDefault}
                                            value={'' + this.state.paymentType}>
                                            <Select
                                                className="Select__Payment-method"
                                                value={this.state.paymentType}
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
                                    <CreditCardMessage paymentType={this.state.paymentType} />
                                </div>

                            </div>
                        </div>
                        {paymentMethodId === 1 ? <div /> :
                            <div>
                                {isAddNewCardVisible &&
                                    <AddNewCard
                                        type={paymentMethodId}
                                        canSaveCard={this.props.hasStoredCardAccess}
                                        isPaymentRequired={this.props.isPaymentRequired}
                                        availableCardTypes={this.props.availableCardTypes}
                                        isAddToStoredCardsSelected={this.props.isAddToStoredCardsSelected}
                                    />
                                }
                                {isSelectedCardVisible &&
                                    <IWSetAsMyDefault className="edit-payment-card"
                                        clearSetAsMyDefault={fieldName => this.props.clearSetAsMyDefault('AddPaymentOrNewCardForm', fieldName, false)}
                                        defaultValue={'' + (safeGet(this.props, paymentMethodId === 2 ? 'defaultCreditCard.storedCardId' : 'defaultProcurementCard.storedCardId') || 'none')}
                                        name={'payment-card__samd'}
                                        show={allowSetAsMyDefault}
                                        value={'' + (safeGet(cardToUse, 'storedCardId') || '')}>
                                        <SelectedPaymentCardView
                                            selectedCard={cardToUse}
                                            onUpdateExpiredCard={this.handleUpdateExpiredCard}
                                        />
                                    </IWSetAsMyDefault>
                                }
                            </div>
                        }
                        {paymentMethodId === 3 &&
                            <FormSection name="procurementFields">
                                <div className="columns small-12 medium-6 large-3">
                                    <label className="form__label--readonly">{t('Reporting fields')}</label>
                                </div>
                                <div className="row expanded is-collapse-child">
                                    { /* we just need four static fields so looping arond a static array */}
                                    {[0, 1, 2, 3].map((item, index) => {
                                        return (
                                            <div key={index} className="columns small-12 medium-6 large-3">
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
                        }
                        {this.props.hasPOFields &&
                            <FormSection name="POSection">
                                <div className="row expanded is-collapse-child">
                                    <div className="column small-12 medium-6">
                                        <IWTextField
                                            label={t('P.O. number')}
                                            name="poNumber"
                                            maxLength={35}
                                            required={isPONumberRequired}
                                        />
                                    </div>
                                    {!this.props.isSupressPOReleaseNumber &&
                                        <div className="column small-12 medium-6">
                                            <IWTextField
                                                label={t('P.O. release number')}
                                                name="poReleaseNumber"
                                                maxLength={35}
                                            />
                                        </div>
                                    }
                                </div>
                            </FormSection>
                        }
                        {this.props.hasTaxOverride &&
                            <div className="row expanded is-collapse-child">
                                <div className="column">
                                    <br />
                                    <label className="row collapse" htmlFor="applyTaxCertificate">
                                        <input
                                            type="checkbox"
                                            id="applyTaxCertificate"
                                            onClick={() => { this.setState({ overrideTax: !this.state.overrideTax }) }}
                                            name="applyTaxCertificate"
                                            defaultChecked={this.state.overrideTax}
                                            className="column shrink form__input--checkbox" />
                                        <span className="column form__label--checkbox">
                                            {t('Check here to apply any applicable tax exemption certificate on file with Insight\'s Tax Department for my account')}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        }
                        {!this.props.isReadOnly &&
                            <div className="row expanded is-collapse-child align-right text-right">
                                <div className="column small-12 medium-shrink">
                                    <IWButton className="expanded section__button no-margin-bot" type="submit" >
                                        {continueText}
                                    </IWButton>
                                </div>
                            </div>
                        }
                    </form>
                </section>
            )
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
    validateReviewOrder: PropTypes.func.isRequired,
    isQuickCheckout: PropTypes.bool,
}

function transformStoredCardToCardInfo(storedCard) {
    return {
        description: storedCard.storedCardDesc,
        expiryMonth: storedCard.storedCardExpMonth,
        expiryYear: storedCard.storedCardExpYear,
        id: storedCard.storedCardId,
        maskedCardNumber: storedCard.displayCardNum,
        nameOnCard: storedCard.storedCardHolderName,
        token: storedCard.storedCardToken,
        type: storedCard.storedCardType,
    }
}
