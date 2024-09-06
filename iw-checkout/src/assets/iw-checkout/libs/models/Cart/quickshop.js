import { post } from '../fetch'
import get from 'lodash-es/get'

export function validateMaterials(materialIds) {
    const body = {
        quickShop: true,
        materialIds: materialIds.split(','),
    }
    return post('compareProducts', body)
}

/**
 * determine if there are any invalid or duplicate parts else
 * add fire add to cart action with valid parts
 * returns true if all parts are valid
 * && !hasInvalidMaterials(response)
 * @param  {[Object]}  response [compare products response]
 * @return {Boolean}          [All parts valid or not]
 */
export function isValidMaterials(response) {
    return ('validMaterialIds' in response && Array.isArray(response.validMaterialIds)
        && response.validMaterialIds.length > 0 && !hasManufaturerProducts(response))
}

export function hasManufaturerProducts(response) {
    return 'duplicateManufaturerProductsMap' in response
        // && typeof response.duplicateManufaturerProductsMap === 'object'
        // && !Array.isArray(response.duplicateManufaturerProductsMap)
        && Object.keys(response.duplicateManufaturerProductsMap).length > 0
}

export function hasInvalidMaterials(response) {
    return 'invalidMaterialIds' in response
        && Array.isArray(response.invalidMaterialIds)
        && response.invalidMaterialIds.length > 0
}
