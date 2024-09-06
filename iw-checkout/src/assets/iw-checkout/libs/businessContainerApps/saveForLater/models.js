import { post } from '../../models/fetch'

/**
 * Saves the cart to the back-end
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
export function saveCart(cartName, cartType, clearSessionCart, overrideName) {
    const data = { cartName, cartType, clearSessionCart, overrideName }
    return post('/insightweb/transaction/cartInfo', data)
    .catch(error => {
        console.warn(`There was an error saving the ${cartType}`, error)
        throw error
    })
}

// "response", "Cart name empty"
// "response", "Name Taken"
// "response", "success"
// "response", "failure"
// http://localhost:8080/insightweb/transaction/cartInfo
// {"cartName":"test", "cartType":"Cart"}
// POST
