import { post } from '../fetch'

/**
 * Adding OEM warranty differs from regular item
 * example request
 * {"materialID":"80MG0001US","warrantyDetail":
 *  {"parentMaterialId":"80MG0001US",
 *  "parentMaterialIDKey":"1",
 *  "warrMaterialId":"5PS0N87367",
 *  "quantity":1,
 *  "contractID":""}}
 * @param {Object} item [description]
 */
export function addOEMToCart(item) {
    return post('/insightweb/transaction/addOEMtocart', item)
        .catch((error) => {
            console.warn(`Failed to add item ${JSON.stringify(item)} to cart`)
            throw error // re-throw error for initial testing of functionality
        })
}

/**
 * Adding IPP warranty differs from regular item
 * @param {Object} item [description]
 */
export function addIPPToCart(item) {
    return post('/insightweb/transaction/addIPPtocart', item)
        .catch((error) => {
            console.warn(`Failed to add item ${JSON.stringify(item)} to cart`)
            throw error // re-throw error for initial testing of functionality
        })
}
