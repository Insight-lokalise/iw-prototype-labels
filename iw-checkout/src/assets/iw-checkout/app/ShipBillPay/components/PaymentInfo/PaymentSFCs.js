import React from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from './../../../../libs/iw-components'
import {
    checkExpired,
    transformCardInfoToStoredCard,
} from './paymentInfoHelpers'
import CreditCardMessage from "../../../messages/CreditCardMessage"

export function PaymentInfoReadOnlyView(props) {
    const { type, cardInfo = null, poNumber = null, poReleaseNumber = null, procurementFields = [] } = props.selectedPayment

    return (
        <div>
            { type !== '1' ? (cardInfo &&
                [<SelectedPaymentCardView
                    selectedCard={transformCardInfoToStoredCard(cardInfo)}
                    />, <CreditCardMessage />])
                :
                <div className="row expanded is-collapse-child">
                    <div className="columns small-6">
                        <label htmlFor="iw-checkout__paymentsfc-terms" className="form__label--readonly">{t('Payment type:')}
                            <p id="iw-checkout__paymentsfc-terms">{t('Terms')}</p>
                        </label>
                    </div>
                </div>
            }
            { procurementFields.length > 0 &&
                <div className="row expanded is-collapse-child">
                    <div className="columns small-12">
                        <label htmlFor="iw-checkout__paymentsfc-reporting" className="form__label--readonly">{t('Reporting fields:')}
                            <p id="iw-checkout__paymentsfc-reporting">{procurementFields.join(', ')}</p>
                        </label>
                    </div>
                </div>
            }
            { props.hasPOFields &&
                <div className="row expanded is-collapse-child">
                    <div className="columns small-6">
                        <label htmlFor="iw-checkout__paymentsfc-po-number" className="form__label--readonly">{t('P.O. number:')}
                            <p id="iw-checkout__paymentsfc-po-number" >{poNumber}</p>
                        </label>
                    </div>
                    { !props.isSupressPOReleaseNumber &&
                        <div className="columns small-6">
                            <label htmlFor="iw-checkout__paymentsfc-po-release-num" className="form__label--readonly">{t('P.O. release number:')}
                                <p id="iw-checkout__paymentsfc-po-release-num">{poReleaseNumber}</p>
                            </label>
                        </div>
                    }
                </div>
            }
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
        displayCardNum,
        storedCardType,
        storedCardHolderName,
        storedCardExpMonth,
        storedCardExpYear,
    } = props.selectedCard
    const cardEndingIn = displayCardNum && displayCardNum.slice(-4)
    const expiryDate = t('Expiration date')
    const nameOnCard = t('Name on card')
    const isExpired = checkExpired(storedCardExpMonth, storedCardExpYear)

    return (
        <div>
            <div className="row expanded is-collapse-child">
                <div className="columns small-12 medium-3">
                    <label htmlFor="iw-checkout__paymentsfc-stored-card-type" className="form__label--readonly">{t('Card:')}
                        <p id="iw-checkout__paymentsfc-stored-card-type">
                            <span className={`hide-for-print icon-cards icon-cards--${storedCardType}`}>
                                <span className="show-for-sr">{storedCardType}</span>
                            </span>
                            <span className="show-for-print print-inline">
                                <strong>{storedCardType}</strong>
                            </span>
                            {` ${t('ending in')} ${cardEndingIn}`}
                        </p>
                    </label>
                </div>
                <div className="columns small-6 medium-3">
                    <label htmlFor="iw-checkout__paymentsfc-card-holder-name" className="form__label--readonly">{`${nameOnCard}:`}
                        <p id="iw-checkout__paymentsfc-card-holder-name">{storedCardHolderName}</p>
                    </label>
                </div>
                <div className="columns small-6 medium-3">
                    <label htmlFor="iw-checkout__paymentsfc-expired" className="form__label--readonly">{`${expiryDate}:`}
                        { isExpired ?
                            <p id="iw-checkout__paymentsfc-expired" className="color--red">{t('Expired')}</p>
                            :
                            <p>{storedCardExpMonth < 10 ? `0${storedCardExpMonth}` : storedCardExpMonth} / {storedCardExpYear}</p>
                        }
                    </label>
                </div>
                { isExpired &&
                    <div className="columns small-12 medium-3 align-self-middle">
                        <a className="button hollow small" onClick={props.onUpdateExpiredCard}>{t('Update card')}</a>
                    </div>
                }
            </div>
            { isExpired &&
                <div className="row expanded is-collapse-child">
                    <div className="column">
                        <p className="form__field-msg form__field-msg--error">
                            {t('* The card has expired. Please edit or delete the information.')}
                        </p>
                    </div>
                </div>
            }
        </div>
    )
}
SelectedPaymentCardView.propTypes = {
    selectedCard: PropTypes.object.isRequired,
    onUpdateExpiredCard: PropTypes.func,
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
                            (value, allValues) => requiredFieldValidation(value, allValues, isRequired, cardNumber),
                            (value) => checkValidCardNumber(value),
                            (value) => checkValidCardType(value, props.availableCardTypes),
                        ]}/>
                </div>
                <div className="columns small-12 medium-6 large-4">
                    <IWTextField
                        label={nameOnCard}
                        name="storedCardHolderName"
                        required={isRequired}
                        validate={(value, allValues) => requiredFieldValidation(value, allValues, isRequired, nameOnCard)}
                        />
                </div>
                <div className="columns small-12 medium-6 large-4">
                    <fieldset>
                        <legend className="form__legend">
                            <p className="form__label">{expiryDate}
                                {isRequired && <span className="form__required">*</span>}
                            </p>
                        </legend>
                        <div className="row row__gutter--tiny collapse">
                            <div className="columns">
                                <IWSelectField className="form__field"
                                    placeholder={expiryMonth}
                                    optionsArrayOrFunction={allowedMonths}
                                    label={expiryMonth}
                                    hideLabel
                                    name='storedCardExpMonth'
                                    validate={[
                                        (value, allValues) => requiredFieldValidation(value, allValues, isRequired, expiryMonth, true),
                                        checkValidExpiryDate,
                                    ]} />
                            </div>
                            <div className="columns">
                                <IWSelectField className="form__field"
                                    placeholder={expiryYear}
                                    optionsArrayOrFunction={allowedYears()}
                                    label={expiryYear}
                                    hideLabel
                                    name='storedCardExpYear'
                                    validate={(value, allValues) => requiredFieldValidation(value, allValues, isRequired, expiryYear, true)}
                                    />
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            {props.canSaveCard &&
                <div className="row expanded is-collapse-child">
                    <div className="columns small-12 medium-6 large-4">
                        <IWCheckboxField className="form__label--inline"
                            name='addToStoredCards'
                            label={addToMyStoredCards}
                            showChildIfChecked >
                            <IWTextField className="form__field"
                                name="storedCardDesc"
                                label={storedCardDesc}
                                placeholder={storedCardDesc}
                                required={isRequired}
                                validate={(value, allValues) => requiredFieldValidation(value, allValues, isRequired, storedCardDesc)}
                                maxLength="40"
                                hideLabel />
                        </IWCheckboxField>
                    </div>
                    {props.isAddToStoredCardsSelected &&
                        <div className="columns small-12 medium-6 large-4">
                            <IWCheckboxField className="form__label--inline"
                                name='isDefaultCard'
                                label={setAsMyDefault}
                                />
                        </div>
                    }
                </div>
            }
        </FormSection>
    )
}

AddNewCard.defaultProps = {
    canSaveCard: true,
}

