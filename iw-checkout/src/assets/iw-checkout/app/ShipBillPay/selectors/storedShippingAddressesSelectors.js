export const selector_storedShippingAddresses = state => state.shipBillPayView.storedShippingAddresses
export const selector_savedShippingAddresses = state => selector_storedShippingAddresses(state).savedAddresses || []
export const selector_defaultShippingAddress = state => selector_storedShippingAddresses(state).defaultAddress || null
