import { fetchTaxAndEWRFee } from './../TaxEWR/taxEWR'
import { getFreightByCarrier } from './../Shipping/shipping'

/** Check if there are shippable items in the cart.  Determine within cart object since
UI flags are not available yet in cart **/
const hasShippableCartItems = (cart) => cart.contracts && Object.values(cart.contracts).some(contract => {
    return contract.cartItems && Object.values(contract.cartItems).some(cartItem => {
        return cartItem.nonShipabble == false
    })
})

/**
 * Identify Shipto Partner and (Carrier ID or (carrier condition, carrier priority))
 * @param  {[type]} cart                   [description]
 * @param  {[type]} locale                 [description]
 * @param  {[type]} showEWR                [description]
 * @param  {[type]} defaultCarrier         [description]
 * @param  {[type]} defaultShippingAddress [description]
 * @return {[type]}                        [description]
 */
export function getAppropriateShippingCarrierAndShipPartner({ cart, locale, defaultCarrier, defaultShippingAddress, isEMEA }) {
    // replicating current prod logic to avoid any missing cases    
    const { taxEstimateOnViewCartVO, quoteOrderRequest } = cart
    let shippingOpionsToUse = {}
    let quoteOrderRequestParametersSelected = false
    // can in any case carrierId or other fields not present
    if (taxEstimateOnViewCartVO) {
        shippingOpionsToUse = {
            shipToPartner: taxEstimateOnViewCartVO.shipToPartner || 0,
            shipCarrierCondition: taxEstimateOnViewCartVO.carrierCondition || '',
            shipCarrierPriority: taxEstimateOnViewCartVO.carrierPriority || '',
            carrierId: taxEstimateOnViewCartVO.carrierId || 0,
        }
    } else if (quoteOrderRequest && quoteOrderRequest.shipTo) {
        // in case of US locale or EMEA we dont need to set anything
        if (locale === 'en_US' || isEMEA) {
            quoteOrderRequestParametersSelected = true
        }
        shippingOpionsToUse = {
            shipToPartner: quoteOrderRequest.shipTo.partnerFunction || 0,
            carrierId: quoteOrderRequest.carrierId || 0,
        }
    } else if (defaultShippingAddress) {
            // Selecting shipping address has partnerId from id property wereas default shipping address has shippingPartnerFunction
        shippingOpionsToUse.shipToPartner = (defaultShippingAddress.id || defaultShippingAddress.shippingPartnerFunction) || 0
        // case with defaultCarrier not present is handled outside of this outer if else
        if (defaultCarrier) {
            shippingOpionsToUse = Object.assign({}, {
                ...shippingOpionsToUse,
                shipCarrierCondition: defaultCarrier.priority.split('|')[1].substring(0, 2),
                shipCarrierPriority: defaultCarrier.priority.split('|')[0],
                carrierId: defaultCarrier.carrierId,
            })
        }
    }
    // set shipCarrierPriority and shipCarrierCondition to empty when there are no shippable parts in the cart
    if(!hasShippableCartItems(cart)) {
        shippingOpionsToUse = Object.assign({}, {
            ...shippingOpionsToUse,
            shipCarrierCondition: "",
            shipCarrierPriority: "",
        })
    }

    return { shippingOpionsToUse, quoteOrderRequestParametersSelected }
}

/**
 * [shouldCallShippingBypermisions description]
 * this logic looks so negative, want it to turn positive, here is scenario
 * if shipping estimator permission is off, user dont have added any shipping info
 * and cart is not convert quote, user not supposed to see shipping
 * ideally this should happen on server side
 * @param  {[type]} cart                 [description]
 * @param  {[type]} showShippingEstimate [description]
 * @return {[type]}                      [description]
 */
export function shouldCallShippingBypermisions({ cart, showShippingEstimate, showEWR, locale, isEMEA }) { 
    // Only check for shipping conditions when there are shippable items in the cart.    
    return hasShippableCartItems(cart) && 
        (showShippingEstimate
        || (showEWR && locale !== 'en_US' && !isEMEA)
        || cart.taxEstimateOnViewCartVO
        || cart.quoteOrderRequest)
}

/**
 * [shouldCallTaxEWR description]
 * @param  {String}  locale    [description]
 * @param  {Boolean} isB2BUser [description]
 * @param  {Boolean}  showEWR   [description]
 * @return {Boolean}            [description]
 */
export function shouldCallTaxEWR({ locale, showEWR, isEMEA }) {
    return (locale === 'en_US' || isEMEA) && showEWR
}

/**
 * [fetchTaxEWRIfWeShould description]
 * @param  {[type]}  cart                   [description]
 * @param  {[type]}  locale                 [description]
 * @param  {[type]}  showEWR                [description]
 * @param  {Boolean} isB2BUser              [description]
 * @param  {[type]}  defaultCarrier         [description]
 * @param  {[type]}  defaultShippingAddress [description]
 * @return {[type]}                         [description]
 */
export function fetchTaxEWRIfWeShould({ cart, locale, showEWR, defaultCarrier, defaultShippingAddress, isEMEA }) {
    let promise = new Promise((resolve, reject) => {
        const appropriateShipping = getAppropriateShippingCarrierAndShipPartner({ cart, locale, defaultCarrier, defaultShippingAddress, isEMEA })
        if (shouldCallTaxEWR({ locale, showEWR, isEMEA }) && (appropriateShipping.quoteOrderRequestParametersSelected ||
            (appropriateShipping.shippingOpionsToUse && appropriateShipping.shippingOpionsToUse.shipToPartner))) {
            fetchTaxAndEWRFee(appropriateShipping)
                .then(resolve)
                .catch(reject)
        } else {
            // resolve no tax and shipping
            reject('Unable to calculate EWR and TAX.')
        }
    })
    return promise
}

/**
 * [fetchFreightOnCartIfWeShould description]
 * @param  {[type]} cart                   [description]
 * @param  {[type]} locale                 [description]
 * @param  {[type]} showEWR                [description]
 * @param  {[type]} defaultCarrier         [description]
 * @param  {[type]} defaultShippingAddress [description]
 * @return {[type]}                        [description]
 */
export function fetchFreightForCartIfWeShould({ cart, locale, showEWR, showShippingEstimate, defaultCarrier, defaultShippingAddress, isEMEA }) {
    let promise = new Promise((resolve, reject) => {
        const appropriateShipping = getAppropriateShippingCarrierAndShipPartner({ cart, locale, defaultCarrier, defaultShippingAddress, isEMEA })
        if (shouldCallShippingBypermisions({ cart, showShippingEstimate, showEWR, locale, isEMEA }) &&
            (appropriateShipping.shippingOpionsToUse &&
            appropriateShipping.shippingOpionsToUse.shipToPartner &&
            appropriateShipping.shippingOpionsToUse.carrierId)) {
            // this is valid condition to fetch shipping and tax
            // fetch shipping from getFreightByCarrier then if user is from US locale
            // and has EWR permissions then also make EWR call
            const body = {
                carrierId: appropriateShipping.shippingOpionsToUse.carrierId,
                shipTo: appropriateShipping.shippingOpionsToUse.shipToPartner,
            }
            getFreightByCarrier({ data: body })
                .then(resolve)
                .catch(reject)
        } else {
            // resolve no tax and shipping
            reject('No shipToPartner or CarrierID or shippable cart items to calculate shipping.')
        }
    })
    return promise
}
