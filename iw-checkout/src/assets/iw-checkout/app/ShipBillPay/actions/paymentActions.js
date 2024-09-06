import {
  GET_AVAILABLE_PAYMENT_OPTIONS,
  GET_STORED_CARDS,
  UPDATE_CREDIT_CARD,
  UPDATE_PROCUREMENT_CARD,
  CREATE_CREDIT_CARD,
  CREATE_PROCUREMENT_CARD,
  UPDATE_PAYMENT,
  UPDATE_PAYMENT_METHOD_DEFAULT,
  UPDATE_PAYMENT_CARD_DEFAULT,
  DELETE_CARD,
  TOGGLE_CARD_EDITABLE,
  GET_PAYMENT_FROM_SHOPPING_REQUEST,
  UPDATE_SELECTED_CREDIT_CARD,
  UPDATE_SELECTED_PROCUREMENT_CARD,
  UPDATE_TAX_EXCEPTION,
  GET_TAX_EXEMPT_FROM_SHOPPING_REQUEST,
  REVIEW_ORDER_VALIDATION,
} from './../constants'

import * as Payment from './../../../libs/models/Payments/payment'
import { validateReviewOrder as _validateReviewOrder } from './../../../libs/models/ShoppingRequest'

export function fetchPaymentMethods() {
  return {
    type: GET_AVAILABLE_PAYMENT_OPTIONS,
    payload: Payment.fetchPaymentMethods(),
  }
}

export function updatePaymentMethodDefault(paymentMethodId) {
  return {
    type: UPDATE_PAYMENT_METHOD_DEFAULT,
    payload: Payment.updatePaymentMethodDefault(paymentMethodId),
  }
}

export function updatePaymentCardDefault(paymentMethodId, paymentCardId) {
  return {
    type: UPDATE_PAYMENT_CARD_DEFAULT,
    payload: Payment.updatePaymentCardDefault(paymentMethodId, paymentCardId),
  }
}

export function fetchStoredCards() {
  return {
    type: GET_STORED_CARDS,
    payload: Payment.fetchStoredCards(),
  }
}

export function updateCard(card, isEMEA = false) {
  return (dispatch) => {
    const isCreditCard = card.storedCardMethodId === 2
    if (isEMEA) {
      Payment.updateCardEMEA(card).then(
        ({ storedCardExpMonth, storedCardExpYear }) => {
          dispatch({
            type: isCreditCard ? UPDATE_CREDIT_CARD : UPDATE_PROCUREMENT_CARD,
            payload: { ...card, storedCardExpMonth, storedCardExpYear },
          })
        }
      )
    } else {
      return dispatch({
        type: isCreditCard ? UPDATE_CREDIT_CARD : UPDATE_PROCUREMENT_CARD,
        payload: Payment.updateCard(card),
      })
    }
  }
}

export function createCard(card) {
  const isCreditCard = card.storedCardMethodId === 2
  return {
    type: isCreditCard ? CREATE_CREDIT_CARD : CREATE_PROCUREMENT_CARD,
    payload: Payment.createCard(card),
  }
}

export function updatePayment(payment) {
  return {
    type: UPDATE_PAYMENT,
    payload: Payment.updatePayment(payment),
  }
}

export function deleteCard(cardId) {
  return {
    type: DELETE_CARD,
    payload: Payment.deleteCard(cardId),
  }
}

export function toggleCardEditable(cardId, paymentType, isEditable) {
  return {
    type: TOGGLE_CARD_EDITABLE,
    payload: {
      cardId,
      paymentType,
      isEditable,
    },
  }
}

export function updateSelectedCreditCard(payload) {
  return {
    type: UPDATE_SELECTED_CREDIT_CARD,
    payload,
  }
}

export function updateSelectedProcurementCard(payload) {
  return {
    type: UPDATE_SELECTED_PROCUREMENT_CARD,
    payload,
  }
}

export function getPaymentFromShoppingRequest() {
  return {
    type: GET_PAYMENT_FROM_SHOPPING_REQUEST,
    payload: Payment.fetchPaymentFromShoppingRequest(),
  }
}

export function getTaxExemptFromShoppingRequest() {
  return {
    type: GET_TAX_EXEMPT_FROM_SHOPPING_REQUEST,
    payload: Payment.fetchTaxExemptFromShoppingRequest(),
  }
}

export function updateTaxExemption(payload) {
  return {
    type: UPDATE_TAX_EXCEPTION,
    payload: Payment.updateTaxExemption(payload),
  }
}

export function validateReviewOrder() {
  return {
    type: REVIEW_ORDER_VALIDATION,
    payload: _validateReviewOrder(),
  }
}
