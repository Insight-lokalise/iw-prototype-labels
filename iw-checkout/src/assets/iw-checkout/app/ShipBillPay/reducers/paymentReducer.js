import findIndex from 'lodash-es/findIndex'
import {
    GET_AVAILABLE_PAYMENT_OPTIONS,
    GET_STORED_CARDS,
    DELETE_CARD,
    TOGGLE_CARD_EDITABLE,
    UPDATE_CREDIT_CARD,
    UPDATE_PROCUREMENT_CARD,
    CREATE_CREDIT_CARD,
    CREATE_PROCUREMENT_CARD,
    GET_PAYMENT_FROM_SHOPPING_REQUEST,
    UPDATE_SELECTED_CREDIT_CARD,
    UPDATE_SELECTED_PROCUREMENT_CARD,
    UPDATE_PAYMENT_METHOD_DEFAULT,
    UPDATE_PAYMENT_CARD_DEFAULT,
} from './../constants'

import { transformCardInfoToStoredCard } from './../components/PaymentInfo/paymentInfoHelpers'

export function paymentSection(state = {}, { type, payload }) {
    switch (type) {
        case `${GET_AVAILABLE_PAYMENT_OPTIONS}_FULFILLED`: {
            return {
                ...state,
                availablePaymentMethods: payload.paymentMethods,
                availableCardTypes: payload.cardTypes,
                defaultPaymentMethod: payload.defaultPayMethod || payload.paymentMethods[0],
                paymentRequired: payload.paymentRequired,
            }
        }

        case `${GET_STORED_CARDS}_FULFILLED`: {
            return {
                ...state,
                storedCreditCards: payload.ccStoredCards,
                storedProcurementCards: payload.procStoredCardses,
            }
        }
        case `${GET_PAYMENT_FROM_SHOPPING_REQUEST}_FULFILLED`: {
            if (!payload) return state
            const nextState = { ...state, selectedPayment: payload }
            const { type, cardInfo = null } = payload
            if (type === '2') {
                nextState.selectedCreditCard = cardInfo ? transformCardInfoToStoredCard(cardInfo, type) : null
            } else if (type === '3') {
                nextState.selectedProcurementCard = cardInfo ? transformCardInfoToStoredCard(cardInfo, type) : null
            }
            return nextState
        }

        case `${UPDATE_PAYMENT_METHOD_DEFAULT}_FULFILLED`: {
            const defaultPaymentMethod = Object.assign([], state.defaultPaymentMethod )
            defaultPaymentMethod.paymentMethodId = payload
            const availablePaymentMethods = Object.assign([], state.availablePaymentMethods )
            availablePaymentMethods.map( (pm) => {
                pm.isDefault = (pm.paymentMethodId === payload);
                return pm;
            } );
            return {
                ...state,
                availablePaymentMethods: availablePaymentMethods,
                defaultPaymentMethod: defaultPaymentMethod,
            }
        }

        case `${UPDATE_PAYMENT_CARD_DEFAULT}_FULFILLED`: {
            const storedCreditCards = Object.assign([], state.storedCreditCards )
            storedCreditCards.map( (sc) => {
                if (sc.storedCardMethodId === payload.paymentMethodId)
                    sc.isDefaultCard = (sc.storedCardId === payload.paymentCardId);
                return sc;
            } );
            return {
                ...state,
                storedCreditCards: storedCreditCards,
            }
            return nextState
        }

        case UPDATE_SELECTED_CREDIT_CARD: {
            return {
                ...state,
                selectedCreditCard: payload,
            }
        }

        case UPDATE_SELECTED_PROCUREMENT_CARD: {
            return {
                ...state,
                selectedProcurementCard: payload,
            }
        }

        case `${DELETE_CARD}_FULFILLED`: {
            const { storedCardMethodId, storedCardId } = payload
            const { storedCreditCards = [], storedProcurementCards = [] } = state
            const nextState = { ...state }
            // need to remove right card from available cards, can be from
            // stored cards or procurement cards
            // we will never hit this reducer if payment type is terms
            if (storedCardMethodId === 2) {
                // stored card
                nextState.storedCreditCards = storedCreditCards.filter(card => card.storedCardId !== storedCardId)
            } else {
                // procuremt card
                nextState.storedProcurementCards = storedProcurementCards.filter(
                    card => card.storedCardId !== storedCardId
                )
            }
            return nextState
        }

        case TOGGLE_CARD_EDITABLE: {
            const { cardId, paymentType, isEditable } = payload
            const { storedCreditCards = [], storedProcurementCards = [] } = state
            const nextState = { ...state }
            if (paymentType === 2) {
                // stored card
                nextState.storedCreditCards = toggleEditableFlag(storedCreditCards, cardId, isEditable)
            } else {
                // procuremt card
                nextState.storedProcurementCards = toggleEditableFlag(storedProcurementCards, cardId, isEditable)
            }
            return nextState
        }
        case UPDATE_CREDIT_CARD:
        case `${UPDATE_CREDIT_CARD}_FULFILLED`: {
            const { storedCreditCards = [] } = state
            const nextState = { ...state }
            // stored card
            nextState.storedCreditCards = insertOrUpdateToList(
                storedCreditCards,
                { ...payload, editable: false },
                'storedCardId'
            )
            return nextState
        }

        case UPDATE_PROCUREMENT_CARD:
        case `${UPDATE_PROCUREMENT_CARD}_FULFILLED`: {
            const { storedProcurementCards = [] } = state
            const nextState = { ...state }
            nextState.storedProcurementCards = insertOrUpdateToList(
                storedProcurementCards,
                { ...payload, editable: false },
                'storedCardId'
            )
            return nextState
        }

        case `${CREATE_CREDIT_CARD}_FULFILLED`: {
            const { storedCardId } = payload
            const { storedCreditCards = [] } = state
            const nextState = { ...state }
            if (storedCardId !== 0) {
                // user choose to store this card
                nextState.storedCreditCards = insertOrUpdateToList(
                    storedCreditCards,
                    { ...payload, editable: false },
                    'storedCardId'
                )
            }
            return nextState
        }

        case `${CREATE_PROCUREMENT_CARD}_FULFILLED`: {
            const { storedCardId } = payload
            const { storedProcurementCards = [] } = state
            const nextState = { ...state }
            if (storedCardId !== 0) {
                // user choose to store this card
                nextState.storedProcurementCards = insertOrUpdateToList(
                    storedProcurementCards,
                    { ...payload, editable: false },
                    'storedCardId'
                )
            }
            return nextState
        }

        default:
            return state
    }
}

function insertOrUpdateToList(list = [], item = {}, key) {
    const listClone = [...list]
    if(item.exceptionsList && item.exceptionsList.length > 0) return listClone
    const foundAt = findIndex(listClone, card => card[key] === item[key])
    if (foundAt === -1) {
        listClone.push(item)
    } else {
        listClone[foundAt] = item
    }
    return listClone
}

function toggleEditableFlag(cards, cardId, isEditable) {
    return cards.map(card => {
        const editable = !!card.editable
        return {
            ...card,
            editable: card.storedCardId === cardId ? (isEditable === undefined ? !editable : isEditable) : false,
        }
    })
}
