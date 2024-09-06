import get from 'lodash-es/get'
import { createSelector } from 'reselect'

import {
    selector_shoppingRequestShipping,
    selector_hasSavedShippingCarrier,
} from '../../../libs/ShoppingRequest/selectors'
import { selector_hasForceCarrierAccountPermission, selector_userEmail, selector_isCES } from '../../../libs/User/selectors'
import { normalizeCarrierValue } from '../components/ShippingOptions/ShippingOptionsHelpers'
import { selector_shoppingRequestCartItems } from '../../../libs/ShoppingRequest/selectors'

export function selector_shippingOptionsSection(state) {
    return get(state, ['shipBillPayView', 'shippingOptionsSection'], {})
}

export function selector_thirdPartyCarriers(state) {
    return get(selector_shippingOptionsSection(state), 'thirdPartyCarriers', [])
}

export function selector_defaultThirdPartyCarrier(state) {
    return selector_thirdPartyCarriers(state).find(carrier => carrier.defaultCarrierAccountNumber) || null
}

export function selector_shippingCarriers(state) {
    return get(selector_shippingOptionsSection(state), 'shippingCarriers', {})
}

export function selector_carriers(state) {
    return get(selector_shippingOptionsSection(state), ['shippingCarriers', 'carriers'], [])
}

export function selector_SLScarriers(state) {
    return get(selector_shippingOptionsSection(state), ['shippingCarriers', 'slsCarriers'], [])
}

export function selector_hasInternationalCarrier(state) {
    return get(selector_shippingOptionsSection(state), ['shippingCarriers', 'internationalCarrFlag'], false)
}

export function selector_defaultShippingCarrier(state) {
    return selector_carriers(state).find(carrier => carrier.defaultCarrier) || false
}

export function selector_defaultSLSCarrier(state) {
    return selector_SLScarriers(state).find(slsCarrier => slsCarrier.defaultCarrier) || false
}

export function selector_hasShippingCarriers(state) {
    return Object.keys(selector_shippingCarriers(state)).length > 0
}

export function selector_defaultAsnEmails(state) {
    return get(selector_shippingCarriers(state), 'asnEmail', '')
}

export function selector_shoppingRequestShippingCarrier(state) {
    return get(selector_shoppingRequestShipping(state), ['carrier'], null)
}

function determineSelectedShippingOption(isCES, shoppingRequestShippingCarrier, defaultShippingCarrier, defaultSLSCarrier) {
    const defaultCarrier = defaultShippingCarrier || defaultSLSCarrier
    const fallback = defaultCarrier
        ? {
              name: defaultCarrier.carrier,
              option: defaultCarrier.condition || defaultCarrier.shippingCode,
              saturday: !!Number(defaultCarrier.saturdayDelivery || defaultCarrier.saturday),
          }
        : {}

    if(isCES) {
        //only cross-check shoppingRequest carrier name for CES users
        if(shoppingRequestShippingCarrier && shoppingRequestShippingCarrier?.name === fallback.name) {
          return shoppingRequestShippingCarrier
        }
        else{
          return fallback
        }
    }
    else {
        return shoppingRequestShippingCarrier || fallback
    }
}

export const selector_selectedShippingOption = createSelector(
    selector_isCES,
    selector_shoppingRequestShippingCarrier,
    selector_defaultShippingCarrier,
    selector_defaultSLSCarrier,
    determineSelectedShippingOption
)

export function selector_hasValidQtyForShipComplete(state) {
    const cartItems = selector_shoppingRequestCartItems(state)
    const items = cartItems.map(item => (!item.materialInfo.nonShipabble ? item.quantity : 0))
    const qtyCount = items.reduce((a, b) => a + b, 0)
    return qtyCount > 1
}

export function selector_carrierAccount(state) {
    const carrier = selector_selectedShippingOption(state)
    const hasSavedCarrier = selector_hasSavedShippingCarrier(state)
    const defaultCarrierAccount = selector_defaultThirdPartyCarrier(state)
    return (
        (carrier && carrier.thirdPartyAccountNumber) ||
        (!hasSavedCarrier && defaultCarrierAccount && defaultCarrierAccount.carrierAccountNumber)
    )
}

export function selector_billMyCarrier(state) {
    return !!selector_carrierAccount(state) || selector_hasForceCarrierAccountPermission(state)
}

function determineShippingOptionsInitialValues(
    shoppingRequestShipping,
    selectedShippingOption,
    userEmail,
    defaultAsnEmails,
    carrierAccount,
    billMyCarrier
) {
    const { additionalShippingNotificationEmail, notes, shipComplete } = shoppingRequestShipping
    const asnEmails = additionalShippingNotificationEmail || defaultAsnEmails
    const separator = (!!asnEmails  && asnEmails.includes(';')) ? ';' : ','
    return {
        billMyCarrier,
        thirdPartyCarrier: carrierAccount || '',
        carrierOption: normalizeCarrierValue(selectedShippingOption),
        additionalEmails: (asnEmails && asnEmails.split(separator)) || [userEmail],
        notes: notes,
        shipComplete: shipComplete,
    }
}

export const selector_shippingOptionsInitialValues = createSelector(
    selector_shoppingRequestShipping,
    selector_selectedShippingOption,
    selector_userEmail,
    selector_defaultAsnEmails,
    selector_carrierAccount,
    selector_billMyCarrier,
    determineShippingOptionsInitialValues
)
