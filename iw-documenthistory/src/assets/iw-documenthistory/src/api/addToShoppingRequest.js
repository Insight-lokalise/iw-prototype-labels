import axios from "axios";

export const addToShoppingRequest = async (reqObj) => {
    try {
        const response = await axios({
            method: "post",
            url: '/api/cart/shoppingrequest/cartitems',
            data: reqObj,
        })
        if (!response.data) throw new Error('Error adding product(s) to cart')
        return response.data
    } catch (err) {
        if (err.response?.data?.message) err = new Error(err.response.data.message)
        console.warn(`Failed to add items to shoppingRequest`, err)
        throw err
    }
}

export default addToShoppingRequest