import reduce from 'lodash-es/reduce'
import mergeWith from 'lodash-es/mergeWith'
import get from 'lodash-es/get'

import { selector_shoppingCartView } from './'
import { selector_user } from '../../../libs/User/selectors'
import { selector_contracts } from '../../../libs/Cart/selectors'

/**
 * Iterates through the cart, collecting information related to usage period
 * reportable items/contracts.
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
export const selectSPLADetails = state => {
    if (!state.cart) return { hasUsageReportableSoftware: null, usageType: null, contractEffectiveDate: null }

    return reduce(state.cart.contracts, (acc, contract) => {
        const contractSPLAInfo = reduce(contract.cartItems, (contractSPLA, item) => {
            const itemSPLAInfo = itemOrLineItemsSPLAInfo(item)
            return mergeWith(contractSPLA, itemSPLAInfo, keepTruthyValues)
        }, { hasUsageReportableSoftware: null, usageType: null })

        if (contractSPLAInfo.hasUsageReportableSoftware) {
            if(contract.startDate) {
                contractSPLAInfo.contractEffectiveDate = contract.startDate
            }
            if(contract.enrollmentID) {
                contractSPLAInfo.enrollmentID = contract.enrollmentID
            }
        }

        return mergeWith(acc, contractSPLAInfo, keepTruthyValues)
    }, { hasUsageReportableSoftware: null, usageType: null, contractEffectiveDate: null })
}

export const selectUsageReporting = state => selector_shoppingCartView(state).usageReporting || {}

export const selectUnlimitedUsagePeriodReporting = state => {
    const { hasUsageReportableSoftware, usageType } = selectSPLADetails(state)
    if (!hasUsageReportableSoftware) return false
    const permissionToCheck = usageType === 'SPLA' ? 'allow_unlimited_spla_ordering' : 'allow_unlimited_citrix_ordering'
    return get(selector_user(state), 'webGroupPermissions', []).includes(permissionToCheck)
}

/**
 * When a user has a cart of Usage Reportable items but has already reported for
 * all available months, the cart is invalid and they can not continue checking out.
 * @param  {Object} state Redux state
 * @return {Boolean}       Whether to disable any links to the next page
 */
export const selector_disableNextPageDueToUsageReporting = state => {
    const hasUsageReportableSoftware = selectSPLADetails(state).hasUsageReportableSoftware
    if (!hasUsageReportableSoftware) return false
    const hasUsagePeriodsToReport = get(selectUsageReporting(state), 'monthsWithReportingDue', []).length > 0 || get(selectUsageReporting(state), 'isUnlimitedOrdering', false)
    return hasUsageReportableSoftware && !hasUsagePeriodsToReport
}

export const selector_hasConflictEnrollmentStatus = state => {
    return state.cart.hasConflictEnrollment;
}

export const selector_enrollmentId = state => {
    const contracts = selector_contracts(state)
    return get(contracts, [Object.keys(contracts)[0], 'enrollmentID'], '')
}

export const selector_conflictEnrollments = state => {
    const contracts = selector_contracts(state)

    let contractObject = JSON.parse(JSON.stringify(contracts))
    let contractKeys = Object.keys(contracts)
    //console.log(contractKeys)
    let enrollments = new Array()
    for(let i = 0; i< contractKeys.length; i++){
        enrollments.push(contractObject[contractKeys[i]].enrollmentID)
    }
    return enrollments
}

function itemOrLineItemsSPLAInfo(item) {
    if (item.bundle) {
        return reduce(item.lineItems, (lineItemSPLA, lineItem) => {
            const lineItemSPLAInfo = {
                usagePeriodReportable: lineItem.usagePeriodReportable,
                usageType: lineItem.usageType,
            }
            return mergeWith(lineItemSPLA, lineItemSPLAInfo, keepTruthyValues)
        }, { hasUsageReportableSoftware: null, usageType: null })
    }

    return {
        hasUsageReportableSoftware: item.usagePeriodReportable,
        usageType: item.usageType,
    }
}

/**
 * _.mergeWith helper to keep the truthy of two values if there is one.
 * @param  {Any} val1
 * @param  {Any} val2
 * @return {Any}
 */
function keepTruthyValues(val1, val2) {
    return val1 || val2
}
