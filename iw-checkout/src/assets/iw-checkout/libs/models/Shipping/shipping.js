import { post, get } from '../fetch'

/**
 * [getFreightByCarrier description]
 * @param  {[type]} payload [description]
 * @return {[type]}         [description]
 */
export function getFreightByCarrier(payload) {
    const timestamp = (new Date()).getTime()
    return post(`transaction/getFreightByCarrier?_=${timestamp}`, payload)
        .catch((error) => {
            console.warn(`Failed to fetch tax and shipping data for : ${JSON.stringify(payload)}`)
            throw error
        })
}

export function fetchShippingCarriers() {
    const timestamp = new Date().getTime()
    return get(`shipBillPay/carriers?_=${timestamp}`)
            .catch(error => { return error })
}

export function fetchThirdPartyCarriers() {
    const timestamp = new Date().getTime()
    return get(`shipBillPay/thirdPartyCarrier?_=${timestamp}`)
            .catch(error => { return error })
}

export function updateCarrierDefault(carrierId) {
    return fetch('carrier/default', {method: "post",
        credentials: "same-origin",
        body: ""+carrierId,
        headers: new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'})} )
    .then( (response) => {
        if (response.ok) {
            return carrierId
        }
    })
    .catch((error) => {
        console.warn('Failed to update payment to shopping request')
        throw error // re-throw error for initial testing of functionality
    })
}
