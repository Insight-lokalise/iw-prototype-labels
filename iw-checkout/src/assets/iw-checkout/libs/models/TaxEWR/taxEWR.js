import { get } from '../fetch'

/**
 * [fetchTaxAndEWRFee description]
 * @param  {[type]} shippingOpionsToUse                 [description]
 * @param  {[type]} quoteOrderRequestParametersSelected [description]
 * @return {[type]}                                     [description]
 */
export function fetchTaxAndEWRFee({ shippingOpionsToUse, quoteOrderRequestParametersSelected }) {
    let url = 'transaction/getTaxAndEWRFeeForReviewOrder'

    if (quoteOrderRequestParametersSelected) {
        url += '?shipTo=&carrier=&shipCondition=&sourcePageOfRequest=ViewCart'
    } else {
        const { shipToPartner = '', shipCarrierPriority = '', shipCarrierCondition = '' } = shippingOpionsToUse
        url += `?shipTo=${shipToPartner}&carrier=${shipCarrierPriority}&shipCondition=${shipCarrierCondition}&sourcePageOfRequest=ViewCart`
    }
    return get(url)
         .catch((error) => {
             throw error
         })
}
