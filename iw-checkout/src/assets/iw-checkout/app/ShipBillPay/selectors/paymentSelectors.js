import get from 'lodash-es/get'
import reduce from 'lodash-es/reduce'
import filter from 'lodash-es/filter'
import {
    selector_hasWebGroupPermission,
    selector_isSharedUser,
    selector_loginAsFlag,
    selector_isEMEA,
} from './../../../libs/User/selectors'
import {
    webGroupPermissions,
} from './../../../libs/User/permissions/webGroupPermissions'

export function selector_paymentSection(state) {
    return get(state, ['shipBillPayView', 'paymentSection'], {})
}

export function selector_defaultPaymentMethod(state) {
    return get(selector_paymentSection(state), 'defaultPaymentMethod', {})
}

export function selector_availablePaymentMethods(state) {
    return get(selector_paymentSection(state), 'availablePaymentMethods', [])
}

export function selector_availableCardTypes(state) {
    return get(selector_paymentSection(state), 'availableCardTypes', [])
}

export function selector_paymentRequired(state) {
    return get(selector_paymentSection(state), 'paymentRequired', true)
}

export function selector_selectedPayment(state) {
    return get(selector_paymentSection(state), 'selectedPayment', null)
}

export function selector_selectedCreditCard(state) {
    return get(selector_paymentSection(state), 'selectedCreditCard', null)
}

export function selector_selectedProcurementCard(state) {
    return get(selector_paymentSection(state), 'selectedProcurementCard', null)
}

export function selector_availablePaymentMethodsMap(state) {
    return reduce(selector_availablePaymentMethods(state), (acc, paymentMethod) => {
        acc[paymentMethod.paymentMethodId] = paymentMethod
        return acc
    }, {})
}

export function selector_storedCreditCards(state) {
    return get(selector_paymentSection(state), 'storedCreditCards', [])
}

export function selector_storedProcurementCards(state) {
    return get(selector_paymentSection(state), 'storedProcurementCards', [])
}

export function selector_defaultCreditCard(state) {
    const storedCreditCards = selector_storedCreditCards(state)
    const isEMEA = selector_isEMEA(state)
    if(isEMEA) {
      return filter(storedCreditCards, ['isDefaultCard', true])[0]
    } else {
      return filter(storedCreditCards, ['isDefaultCard', true])[0] || ( storedCreditCards.length === 1 ? storedCreditCards[0] : null)
    }

}

export function selector_defaultProcurementCard(state) {
    const storedProcurementCards = selector_storedProcurementCards(state)
    const isEMEA = selector_isEMEA(state)
    if(isEMEA){
      return filter(storedProcurementCards, ['isDefaultCard', true])[0]
    } else {
      return filter(storedProcurementCards, ['isDefaultCard', true])[0] || ( storedProcurementCards.length === 1 ? storedProcurementCards[0] : null)
    }

}

export function selector_hasPOFields(state) {
    return !selector_hasWebGroupPermission(state, webGroupPermissions.HIDE_PO_FIELDS_CHECKOUT)
}

export function selector_hasPONumberRequired(state) {
    return selector_hasWebGroupPermission(state, webGroupPermissions.REQ_PO_NUM_AT_CHECKOUT)
}

export function selector_hasSupressPOReleaseNumber(state) {
    return selector_hasWebGroupPermission(state, webGroupPermissions.SUPPRESS_PO_RELEASE_CHECKOUT)
}

export function selector_useWebReferenceNumberAsPO(state) {
    return selector_hasWebGroupPermission(state, webGroupPermissions.WEB_REFERENCE_PO_DEFAULT)
}

export function selector_hasStoredCardAccess(state) {
    return !selector_isSharedUser(state) && !selector_loginAsFlag(state)
}

export function selector_initialValuesForPaymentForm(state) {
    const payment = selector_selectedPayment(state)
    if (!payment) return {};
    const {
        poNumber = '',
        poReleaseNumber = '',
        procurementFields = [],
        type,
    } = payment
    return {
        procurementFields,
        POSection: {
            poNumber,
            poReleaseNumber,
        },
    }
}
