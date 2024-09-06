export const selector_shipBillPayView = state => state.shipBillPayView
export const selector_storedBillingAddresses = state => selector_shipBillPayView(state).storedBillingAddresses
export const selector_savedBillingAddresses = state => selector_storedBillingAddresses(state).savedAddresses || []
export const selector_startPage = state => selector_storedBillingAddresses(state).startPage || []
export const selector_totalPages = state => selector_storedBillingAddresses(state).totalPages || []
export const selector_totalRecords = state => selector_storedBillingAddresses(state).totalRecords || []
export const selector_defaultBillingAddress = state => selector_storedBillingAddresses(state).defaultAddress || null
