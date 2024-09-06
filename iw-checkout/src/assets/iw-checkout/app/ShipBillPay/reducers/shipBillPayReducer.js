import { combineReducers } from 'redux'

import { storedShippingAddresses } from './storedShippingAddressesReducer'
import { storedBillingAddresses } from './storedBillingAddressesReducer'
import { billingAddressSection } from './billingAddressReducer'
import { shippingAddressSection } from './shippingAddressReducer'
import { paymentSection } from './paymentReducer'
import { shippingOptionsSection } from './shippingOptionsReducer'

export const shipBillPayView = combineReducers({
    storedShippingAddresses,
    storedBillingAddresses,
    shippingAddressSection,
    billingAddressSection,
    paymentSection,
    shippingOptionsSection,
})
