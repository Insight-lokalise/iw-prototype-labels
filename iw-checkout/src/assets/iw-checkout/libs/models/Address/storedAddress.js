import { post } from '../fetch'

const _storedAddressRequest = {
    startPage: 1,
    recordsPerPage: 5,
    webGroupId: 0,
    loginProfileId: 0,
    shipIndicator: true, /* true - Shipping , false - Billing */
    shipToBillToSearch: {
        shipToBillToSearchType: 'All',
        searchText: null,
    },
};

/**
 * shippingbilling info service call to fetch shippingBillingAddress
 * @param  {[type]} materialID         [description]
 * @param  {[type]} contractId         [description]
 * @param  {[type]} softwareContractId [description]
 * @return {[type]}                    [description]
 */
export function fetchStoredAddress(searchObj) {
    let body = _storedAddressRequest
    if (searchObj !== undefined) {
        body = Object.assign({}, _storedAddressRequest, {
            shipIndicator: searchObj.shipIndicator,
            startPage: searchObj.startPage,
            recordsPerPage: searchObj.recordsPerPage || _storedAddressRequest.recordsPerPage,
        })
        body.shipToBillToSearch.searchText = searchObj.searchKey
    }

    return post('transaction/getShippingBillingAddresses', body)
        .catch((error) => {
            console.warn('Failed to fetch stored address')
            throw error // re-throw error for initial testing of functionality
        })
}
