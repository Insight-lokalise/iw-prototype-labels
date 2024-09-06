import { fetchTaxAndEWRFee } from './../taxEWR'
import { get } from './../../fetch/fetch'

jest.mock('./../../fetch/fetch', () => ({
    get: jest.fn(() => Promise.resolve()),
}))

describe('fetchTaxAndEWRFee', () => {
    it('should make a GET call', () => {
        fetchTaxAndEWRFee({ shippingOpionsToUse: {} })
        expect(get).toBeCalled()
    })

    it('should construct a URL based on shipping options', () => {
        fetchTaxAndEWRFee({
            shippingOpionsToUse: {
                shipToPartner: 'shipToPartner',
                shipCarrierPriority: 'shipCarrierPriority',
                shipCarrierCondition: 'shipCarrierCondition',
            },
        })

        const expectedURL = 'transaction/getTaxAndEWRFeeForReviewOrder'
            + '?shipTo=shipToPartner&carrier=shipCarrierPriority'
            + '&shipCondition=shipCarrierCondition&sourcePageOfRequest=ViewCart'
        expect(get).toBeCalledWith(expectedURL)
    })

    it('should default to empty shippingOptions if we are fetching for a quote', () => {
        fetchTaxAndEWRFee({
            quoteOrderRequestParametersSelected: true,
        })

        const expectedURL = 'transaction/getTaxAndEWRFeeForReviewOrder'
            + '?shipTo=&carrier='
            + '&shipCondition=&sourcePageOfRequest=ViewCart'
        expect(get).toBeCalledWith(expectedURL)
    })
})
