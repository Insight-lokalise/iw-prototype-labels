import { get, post } from '../fetch';

export function getShippingEstimate(zipcode) {
    return get(`transaction/getFreight?zipCode=${zipcode}`)
        .catch((error) => {
            console.warn('Failed to fetch cart');
            throw error; // re-throw error for initial testing of functionality
        });
}

export function updateShippingCarrier(freight) {
    return post('transaction/saveFreight', freight)
        .catch((error) => {
            console.warn(`Failed to add item ${JSON.stringify(freight)} to cart`);
            throw error; // re-throw error for initial testing of functionality
        });
}
