import creditCardType from 'credit-card-type'
import cardValidator from 'card-validator'
import get from 'lodash-es/get'

import { t } from '@insight/toolkit-utils/lib/labels'
import { cardTypes } from './../../constants'


export function requiredFieldValidation(value, allValues, isPaymentRequired, fieldLabel, isSelectBox = false) {
    const isRequired = checkIfAnyFieldPopulated(value, allValues)
    const errorMessage = `${fieldLabel} ${t('is required')}`
    return (isRequired || isPaymentRequired) && !value ? errorMessage : undefined
}

export function checkValidCardType(number = null, allowedCardTypes = []) {
    if (allowedCardTypes.length === 0 || !number) return undefined
    const type = (creditCardType(number).length > 0 && cardTypes[creditCardType(number)[0].type]) || null
    const cardTypeDisplayNameMap = {
        AMEX: 'American Express',
        DISC: 'Discover',
        MC: 'MasterCard',
        VISA: 'VISA',
        DINERS_CLUB: 'Diners Club',
        JCB: 'JCB',
        UNIONPAY: 'UnionPay',
        MAESTRO: 'Maestro',
    }
    const errorMessage = `${cardTypeDisplayNameMap[type] || t('This') } ${t('card type is not supported')}`
    return allowedCardTypes.includes(type) ? undefined : errorMessage
}

export function checkValidCardNumber(number = null) {
    if (!number) return undefined
    const cardNumberValidation = cardValidator.number(number)
    const errorMessage = `${t('Please enter valid card number')}`
    return cardNumberValidation.isValid ? undefined : errorMessage
}

export function checkValidExpiryDate(value, allValues) {
    const selectedYear = get(allValues, ['cardInfo', 'storedCardExpYear'], null)
    const expiryYear = Number(selectedYear)
    if (!expiryYear) return // No error if they haven't selected a year yet.
    if (checkExpired(value, expiryYear)) {
        return t('Date entered has passed.')
    }
}

export function checkIfAnyFieldPopulated(value, allValues) {
    const { cardInfo = {} } = allValues
    return Object.keys(cardInfo).length > 0
}

export function checkExpired(exMonth, exYear) {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    return (currentYear > exYear || (currentYear === exYear && currentMonth > exMonth))
}

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
export const allowedMonths = months.reduce((acc, item)=>{
    const month = [{ value: Number(item), displayName: item < 10 ? `0${item}` : item }]
    return acc.concat(month)
}, [])

export const allowedYears = () => {
    const currentYear = new Date().getFullYear()
    let allowedYears = []
    for (var i = currentYear; i <= (currentYear + 10); i++) {
        allowedYears.push({ value: Number(i), displayName: i })
    }
    return allowedYears
}

export function transformCardInfoToStoredCard(cardInfo, type) {
    return {
        storedCardId: cardInfo.id,
        storedCardToken: cardInfo.token,
        storedCardType: cardInfo.type,
        storedCardHolderName: cardInfo.nameOnCard,
        storedCardExpMonth: cardInfo.expiryMonth,
        storedCardExpYear: cardInfo.expiryYear,
        displayCardNum: cardInfo.maskedCardNumber,
        storedCardMethodId: Number(type),
    }
}
