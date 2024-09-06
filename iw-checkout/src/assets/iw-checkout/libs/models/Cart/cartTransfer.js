import { post } from '../fetch'

export function fetchTransferCart({ eProcType, ...payload }) {
    let url
    switch (eProcType) {
        case 'CX':
            url = '/insightweb/b2b/cxml/transferCart'
            break
        case 'EB':
            url = '/insightweb/b2b/oci/transferOCICart'
            break
        case 'OA':
            url = '/insightweb/b2b/oag/transferOagCart'
            break
        default:
            throw Error(`Unexpected eProcType - ${eProcType}`)
    }
    return post(url, payload)
        .catch((error) => {
            console.warn(`Failed to fetch transfer cart for ${JSON.stringify(payload)}`)
            throw error
        })
}
