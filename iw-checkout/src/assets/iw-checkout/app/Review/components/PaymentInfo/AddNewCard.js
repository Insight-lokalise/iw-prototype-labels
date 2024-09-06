import React, { Component } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import {FormSection} from "redux-form";
import {IWTextField, IWSelectField, IWCheckboxField} from "../../../../libs/iw-components/iw-form";
import {
    allowedMonths,
    allowedYears,
    requiredFieldValidation,
    checkValidCardType,
    checkValidCardNumber,
    checkValidExpiryDate,
} from './paymentInfoHelpers'
import PropTypes from "prop-types";

export class AddNewCard extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(this.props) !== JSON.stringify(nextProps)
            || JSON.stringify(this.state) !== JSON.stringify(nextState);
    }

    render() {
        const isRequired = this.props.isPaymentRequired
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
                                (value) => checkValidCardType(value, this.props.availableCardTypes),
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
                            <label className="form__label">
                                <span className="form__label__text">{expiryDate}
                                    {isRequired && <span className="form__required">*</span>}
                                </span>
                            </label>
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
                {this.props.canSaveCard &&
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
                    {this.props.isAddToStoredCardsSelected &&
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
}

AddNewCard.defaultProps = {
    canSaveCard: true,
}

AddNewCard.propTypes = {
    isPaymentRequired: PropTypes.bool.isRequired,
    canSaveCard: PropTypes.bool.isRequired,
    availableCardTypes: PropTypes.array.isRequired,
}
