import { get, post, del } from './../fetch'

export function fetchPaymentMethods() {
  const timestamp = new Date().getTime()
  return get(`shipBillPay/paymentMethods?_=${timestamp}`)
}

export function fetchStoredCards() {
  const timestamp = new Date().getTime()
  return get(`shipBillPay/cards?_=${timestamp}`)
}

export function updateCard(card) {
  return post('shipBillPay/card', card).catch((error) => {
    console.warn('Failed to update card')
    throw error // re-throw error for initial testing of functionality
  })
}

export function updateCardEMEA({
  storedCardExpMonth,
  storedCardExpYear,
  storedCardId,
}) {
  const request = {
    cardExpiryMonth: parseInt(storedCardExpMonth),
    cardExpiryYear: parseInt(storedCardExpYear),
    storedCardId,
  }
  return post('updateTokenDetails', request).catch((error) => {
    console.warn('Failed to update card')
    throw error // re-throw error for initial testing of functionality
  })
}

export function createCard(card) {
  return post('shipBillPay/card', card).catch((error) => {
    console.warn('Failed to create card')
    throw error // re-throw error for initial testing of functionality
  })
}

export function createCardEMEA(card) {
  return post('shipBillPay/emea/card', card).catch((error) => {
    console.warn('Failed to create card')
    throw error // re-throw error for initial testing of functionality
  })
}

export function updatePayment(payment) {
  return post('shoppingRequest/billing/payment', payment).catch((error) => {
    console.warn('Failed to update payment to shopping request')
    throw error // re-throw error for initial testing of functionality
  })
}

// TODO: The server requests json, but payload (body) is not json only a number. The server side call needs to change
// and this call needs to changed in coordination with it.
export function updatePaymentMethodDefault(paymentMethodId) {
  return fetch('payment/default', {
    method: 'post',
    credentials: 'same-origin',
    body: `${paymentMethodId}`,
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  })
    .then((response) => {
      if (response.ok) {
        return paymentMethodId
      }
    })
    .catch((error) => {
      console.warn('Failed to update payment to shopping request')
      throw error // re-throw error for initial testing of functionality
    })
}

export function updatePaymentCardDefault(paymentMethodId, paymentCardId) {
  return get(`card/default/${paymentCardId}/${paymentMethodId}`)
    .then((response) => {
      if (response.ok) {
        return {
          paymentMethodId,
          paymentCardId,
        }
      }
    })
    .catch((error) => {
      console.warn('Failed to update payment to shopping request')
      throw error // re-throw error for initial testing of functionality
    })
}

export function updateTaxExemption(payment) {
  return post('shoppingRequest/soldTo/taxExemption', payment).catch((error) => {
    console.warn('Failed to update taxExemption to shopping request')
    throw error // re-throw error for initial testing of functionality
  })
}

export function deleteCard(cardId) {
  const timestamp = new Date().getTime()
  return del(`shipbillpay/card/${cardId}?_=${timestamp}`).catch((error) => {
    console.warn('Failed to delete card')
    throw error // re-throw error for initial testing of functionality
  })
}

export function fetchPaymentFromShoppingRequest() {
  return get('shoppingRequest/billing/payment')
}

export function fetchTaxExemptFromShoppingRequest() {
  return get('shoppingRequest/soldTo/taxExemption')
}

/*
 * Gets the worldpay iframe URL
 * params id: stored card id {integer}, when fetching iframe for new card, id is 0
 * params ref: web reference number, it will be always 0 unless we are requesting iframe for requisition
 * @return {Object}
 * */
export function fetchWPFrame({ id, ref }) {
  return get(`payment?id=${id}&ref=${ref}`).catch((error) => {
    console.warn('Failed to fetch worldpay Iframe')
    throw error
  })
}

/*
 * Gets the paymetric iframe URL
 * params id: cvv required {boolean}, card types {list}, hostUri, cssUri when fetching iframe for new card, id is 0
 * @return {Object}
 * */
export function fetchPMFrame(pmRequest) {
  return post('paymetrics-iFrame', pmRequest).catch((error) => {
    console.warn('Failed to fetch paymetrics Iframe')
    throw error
  })
}

/*
 * Gets the new paymetric iframe URL for 3DS2 card screening
 * params id: enable3DS {boolean}, redirectUrl {string}, cvvRequired {boolean}, hostUri, cssUri when fetching iframe for new card, (id is 0)
 * @return {Object}
 * */
export function fetchPM3DSFrame(pmRequest) {
  return post('paymetrics-3ds-iFrame', pmRequest).catch((error) => {
    console.warn('Failed to fetch paymetrics Iframe')
    throw error
  })
}

/*
 * Gets the new access token when using a saved card for 3DS2 card screening
 * params id: enable3DS {boolean}, redirectUrl {string}, cvvRequired {boolean} when fetching iframe for new card, (id is 0)
 * @return {Object}
 * */
export function fetchPM3DSSaved(storedCardId, pmRequest) {
  return post(`paymetrics-3ds-save/${storedCardId}`, pmRequest).catch(
    (error) => {
      console.warn('Failed to fetch paymetrics Iframe')
      throw error
    }
  )
}

/*
 * Gets the submitted card data
 * params id: token
 * @return {Object}
 * */
export function submitPayMetricData(token) {
  return get(`paymetrics-token?accessCode=${token}`).catch((error) => {
    console.warn('Failed to fetch card data')
    throw error
  })
}

/*
 * Gets the 3DS2 authorization results of submitted card data
 * params payload: { accessToken, cvvRequired, enable3DS, cvv }
 * @return {Object}
 * */
export function submit3DSPayMetricData(pmRequest) {
  return post('paymetrics-3ds-token', pmRequest).catch((error) => {
    console.warn('Failed to fetch paymetrics token')
    throw error
  })
}

/*
 * Gets the card token
 * params id: card number
 * @return {Object}
 * */
export function xipaytokenization(cardNo) {
  return post('xipaytokenization', cardNo).catch((error) => {
    console.warn('Failed to get token')
    throw error
  })
}

/*
 * Fetches a new web reference number for 3DS2 order
 * @return number
 * */
export function fetchWebRefNumber() {
  return post('paymetrics-web-reference', {}).catch((error) => {
    console.warn('Failed to get web reference number')
    throw error
  })
}

/*
 * Gets ISO code mapping
 * params { currencyCodes: Array, countryCodes: Array }
 * @return {Object}
 * */
export function fetchIsoCodes(payload) {
  return post('get-iso-codes', payload).catch((error) => {
    console.warn('Failed to get token')
    throw error
  })
}
