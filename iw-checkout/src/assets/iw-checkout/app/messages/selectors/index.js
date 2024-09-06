import { createSelector } from "reselect"
import { selector_shoppingRequestBilling } from "../../../libs/ShoppingRequest/selectors"
import { selector_userInformation } from "../../../libs/User/selectors"

const PAYMENT_TYPE_CREDITCARD = 2

const ENABLE_MSG_IN_COUNTRY_CODES = ['AU']

const selector_selectedPaymentType = state => {
  const payment = selector_shoppingRequestBilling(state).payment
  return payment ? payment.type : undefined
}

const selector_propsPaymentType = (_, props) => props ? props.paymentType : undefined

const selector_countryCode = state => selector_userInformation(state).CountryCode

export const selector_isEnableCreditCardMessage = createSelector(
  selector_selectedPaymentType,
  selector_countryCode,
  selector_propsPaymentType,
  (selectedPaymentType, countryCode, paymentType) =>
    ENABLE_MSG_IN_COUNTRY_CODES.includes(countryCode) && (paymentType === PAYMENT_TYPE_CREDITCARD ||
    (!paymentType && selectedPaymentType === PAYMENT_TYPE_CREDITCARD.toString()))
)
