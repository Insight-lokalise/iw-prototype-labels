import { post } from '../fetch'

const _productAccessoriesRequest = {
    loadAccessories: true,
    accessoriesProductsMax: 25,
    similarMaterialId: '',
    softwareContractIds: [],
    contractId: '',
    cartFlag: true,
};

/**
 * Porduct info service call to fetch accessories
 * @param  {[type]} materialID         [description]
 * @param  {[type]} contractId         [description]
 * @param  {[type]} softwareContractId [description]
 * @return {Promise}                   [description]
 */
export function fetchAccessories({ materialID, contractID = null, softwareContractId }) {
    const body = Object.assign({}, _productAccessoriesRequest, {
        similarMaterialId: materialID,
        contractId: contractID === '' ? null : contractID,
        softwareContractIds: softwareContractId ? [softwareContractId] : [],
    })
    return post('getProductInfo', body)
        .catch((error) => {
            console.warn('Failed to fetch cart')
            throw error // re-throw error for initial testing of functionality
        })
}
