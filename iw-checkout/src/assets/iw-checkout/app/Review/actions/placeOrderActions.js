import { PLACE_ORDER, TERMS_CONDITIONS } from './../constants'
import { getTermsAndConditions, placeShoppingRequestOrder } from './../../../libs/models/ShoppingRequest'

export function placeOrder(data) {
    return {
        type: PLACE_ORDER,
        payload: placeShoppingRequestOrder(data),
    }
}

export function termsAndConditions(termId,revisionId) {
  return {
    type: TERMS_CONDITIONS,
    payload: getTermsAndConditions(termId,revisionId),
  }
}
