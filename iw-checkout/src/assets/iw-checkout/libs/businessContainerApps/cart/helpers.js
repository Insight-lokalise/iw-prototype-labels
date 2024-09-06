import moment from "moment"

export function nameThatForm(contractID, bundleParentMaterialIDKey, materialIDKey) {
    return `lineLevelForm__${contractID}__${bundleParentMaterialIDKey}__${materialIDKey}`
}

export function prependedSmartTrackersWithString(smartTrackersObject = {}) {
    return Object.keys(smartTrackersObject).reduce((acc, currLineLevel) => {
        const revisedSmartTracker = Object.assign(
            {},
            { ...smartTrackersObject[currLineLevel] },
            { lineLevelId: `st-${smartTrackersObject[currLineLevel].lineLevelId}` }
        )
        acc[`st-${currLineLevel}`] = revisedSmartTracker
        return acc
    }, {})
}


export function orderSmartTrackers(smartTrackersObject) {
    return Object.keys(smartTrackersObject)
        .map(id => smartTrackersObject[id])
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .reduce((acc, curr) => {
            const partnersToPostionMap = {
                reportingparent: 0,
                singlesoldto: 1,
                webgroup: 2,
                requestorgroup: 3,
            }
            const partnerLevelIsNull = curr.partnerLevel === null
            const mapKey = partnerLevelIsNull ? 4 : partnersToPostionMap[curr.partnerLevel.replace(/\s/g, '').toLowerCase()]
            if (acc[mapKey]) {
                acc[mapKey].push(curr)
            } else {
                acc[4].push(curr)
            }
            return acc
        }, [[], [], [], [], []])
        .reduce((acc, curr) => acc.concat(curr), [])
}

/* When the apple part is enrolled, cart response will have apple DEP as separate part and instead of displaying as separate item in cart,
 we need to get the customerID and prepopulate in the parent item */

export function filterNonDEPCartItems (cartItems){
    const parentItems = Object.values(cartItems).filter(item => !item.bundle && item.parentMaterialId === 0)
    const childItems = Object.values(cartItems).filter(item => !item.bundle && item.parentMaterialId > 0)

     const filteredItems =  Object.values(cartItems).map(item => {
         if(item.bundle){
             parentItems.push(item)
         }else{
             childItems.length > 0 ? parentItems.map(parentItem => {
                                     const customerId =  childItems.find(childItem => childItem.materialIDKeyAsInt === parentItem.childEnrollmentId)
                                     parentItem.customerId = customerId && customerId.customerId || null
                                     parentItem.DEPInsightPart = customerId && customerId.materialID || ''
                                     parentItem.isDEPDisabled =   customerId && customerId.quoteItemNumber
                                     return parentItem
                                 }): parentItems
             return parentItems
         }
         return parentItems
     })
    return parentItems.reduce((obj, item) => {
        obj[item.materialIDKey] = item
        return obj
    }, {})


}

export function filterBundleDEPItems(lineItems, cartItems){
    const parentItems = Object.values(lineItems).filter(item => item.parentMaterialId === 0)
    const childItems = Object.values(lineItems).filter(item => item.parentMaterialId > 0)
    const nonBundleItems = Object.values(cartItems).filter(item => !item.bundle)

    const filteredItems = childItems.length > 0 ? parentItems.map(parentItem => {
        const childCustomerId =  childItems.find(childItem => childItem.materialIDKeyAsInt === parentItem.childEnrollmentId)
        const outsideCustomerId =  nonBundleItems.find(childItem => childItem.materialIDKeyAsInt === parentItem.childEnrollmentId)
        parentItem.customerId = childCustomerId && childCustomerId.customerId || outsideCustomerId && outsideCustomerId.customerId || null
        parentItem.DEPInsightPart = childCustomerId && childCustomerId.materialID || outsideCustomerId && outsideCustomerId.customerId || ''
        parentItem.isDEPDisabled =   childCustomerId && childCustomerId.quoteItemNumber
        return parentItem
    }): (nonBundleItems.length >0 ? parentItems.map(parentItem => {
        const customerId =  nonBundleItems.find(childItem => childItem.materialIDKeyAsInt === parentItem.childEnrollmentId)
        parentItem.customerId = customerId && customerId.customerId || null
        parentItem.DEPInsightPart = customerId && customerId.materialID || ''
        parentItem.isDEPDisabled =   customerId && customerId.quoteItemNumber
        return parentItem
    }): parentItems)
    return filteredItems.reduce((obj, item) => {
        obj[item.materialIDKey] = item
        return obj
    }, {})
}

/* When the apple part is enrolled for bundle that created from SMART, cart response will have apple DEP as separate part with in bundle or outside of bundle
   Get the outside bundle item map to the items inside bundle and get customer ID of the matched item */

export function getBundleOutsideChildItems(cartItems){
    const bundleItems = Object.values(cartItems).filter(item => item.bundle)
    const nonBundleItems = Object.values(cartItems).filter(item => !item.bundle)

    if(bundleItems.length > 0 && nonBundleItems.length > 0){
        let outOfBundleChild = []
        const bundleItem = bundleItems.map(bundleItem => {
           const items = bundleItem.lineItems.map(lineItem => {
                const childOutside =  nonBundleItems.find(item => item.materialIDKeyAsInt === lineItem.childEnrollmentId)
                if(childOutside){
                    return outOfBundleChild.push(childOutside.materialIDKeyAsInt)
                }
                return outOfBundleChild
            })
            return outOfBundleChild
        })
        return outOfBundleChild
    }
}


export function isNewEnrollmentID(enrollmentInfo, erpManufaturerId, customerId){
    if (!customerId) {
        return false
    }
    const enrollment = enrollmentInfo[erpManufaturerId]
    return enrollment && !enrollment.partners.includes(customerId)

}

export function enrollmentInfoToUpdate(enrollmentInfo) {
    const { DEPOptIn, DEPOptOut, isCheckoutDisabled } = enrollmentInfo
    const optInPartners = DEPOptIn.length > 0 ? DEPOptIn.map(item => (
        {
            ...(!!item.childId && {childId: item.childId}),
            contractId: item.contractId,
            customerId: item.customerId,
            parentId: item.parentId,
        }
    )) : []

    const optOutPartners =  DEPOptOut.length > 0 ? DEPOptOut.map(item => (
        {
            parentId: item.parentId,
            contractId: item.contractId,
        }
    )) : []

    const hasEnrollmentInfoToUpdate = optInPartners.length > 0 || optOutPartners.length > 0
    return {hasEnrollmentInfoToUpdate, isCheckoutDisabled, optInPartners, optOutPartners}
}

export function formatUTCDate(date) {
    return `${moment(date).format('YYYY-MM-DD')} ${moment().format('HH:mm:ss Z')}`
}