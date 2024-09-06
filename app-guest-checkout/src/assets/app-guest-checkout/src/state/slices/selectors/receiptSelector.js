export const selector_receipt = (state) => state.receipt || {}
export const selector_shoppingRequest = (state) =>
  selector_receipt(state)?.shoppingRequest || null
export const selector_lineLevelSessionInfos = (state) =>
  selector_receipt(state)?.lineLevelSessionInfos || []
export const selector_address = (state, type) =>
  selector_shoppingRequest(state)?.[type] || {}
export const selector_cart = (state) =>
  selector_shoppingRequest(state)?.cart || {}
export const selector_cartItems = (state) =>
  selector_cart(state).cartItems || []
export const selector_summary = (state) => selector_cart(state).summary || {}
export const selector_cartItem = (state, materialId = '') =>
  selector_cartItems(state)?.find(
    (part) => part.materialInfo.materialId === materialId
  ) || {}
export const selector_hasWarrantyItem = (state) => {
  const cartItems = selector_cartItems(state)
  const warrantyItems =
    cartItems.length > 0 && cartItems.filter((item) => item.cartItemWarranty)
  return warrantyItems.length > 0
}
export const selector_hasShippableItems = (state) => {
  const cartItems = selector_cartItems(state)
  const shippableItems =
    cartItems.length > 0 &&
    cartItems.filter((item) => !item.materialInfo.nonShipabble)
  return shippableItems.length > 0
}
export const selector_warranty = (state, materialId = '') =>
  selector_cartItem(state, materialId)?.warranty
export const selector_meterialInfo = (state, materialId = '') =>
  selector_cartItem(state, materialId)?.materialInfo
export const selector_orderMetaData = (state) =>
  selector_shoppingRequest(state)?.orderMetaData || {}
export const selector_userInfo = (state) =>
  selector_orderMetaData(state)?.userContact || {}
export const selector_soldTo = (state) =>
  selector_shoppingRequest(state).soldTo || {}
export const selector_isFirstTimeAddressCreation = (state, type) => {
  return Object.values(selector_address(state, type)).every(
    (value) => value == false
  )
}
export const selector_shoppingRequestShippingObj = (state) =>
  selector_shoppingRequest(state).shipping || {}
export const selector_shoppingRequestBillingObj = (state) =>
  selector_shoppingRequest(state).billing || {}
export const selector_payment = (state) =>
  selector_shoppingRequestBillingObj(state)?.payment || {}

export function selector_additionalShippingNotificationEmail(state) {
  const notificationEmails =
    selector_shoppingRequest(state)?.shipping
      ?.additionalShippingNotificationEmail || null
  const separator =
    !!notificationEmails && notificationEmails.includes(';') ? ';' : ','
  const seperatedNotificationEmail =
    notificationEmails && notificationEmails.split(separator)
  const userContactEmail = selector_userInfo(state)?.email
  return notificationEmails
    ? seperatedNotificationEmail
    : userContactEmail
    ? [userContactEmail]
    : null
}

export function selector_shoppingRequestShipping(state) {
  return selector_shoppingRequest(state).shipping?.address?.address1
}

export function selector_shoppingRequestSummary(state) {
  return selector_shoppingRequest(state)?.cart?.summary
}

export function selector_shoppingRequestEWRFee(state) {
  return selector_shoppingRequest(state)?.cart?.summary?.ewrFee
}

export const selector_overrideFields = (state, type) => {
  const {
    phone = '',
    attentionLine = '',
    shipComplete = false,
    companyName = '',
  } = selector_address(state, type)
  return type === 'shipping'
    ? {
        phone,
        attentionLine,
        shipComplete,
        companyName,
      }
    : {
        phone,
        attentionLine,
        companyName,
      }
}
