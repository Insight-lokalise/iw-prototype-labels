import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
    selector_cartItemsGAE,
    selector_isOrderTemplate,
    selector_isSavedQuote,
} from '../../../../libs/Cart/selectors/cartResponse'
import {selector_isQuickCheckout} from '../../../../libs/Cart/selectors/shoppingCartView'
import {
    updateBillingAddressDefault,
    updateShippingAddressDefault,
} from '../../actions'

import {normalizeToPurchaseOrderAddress} from '../../../../libs/models/Address/address'
import {fetchPopulateUIFlags} from '../../../../libs/OrderMetaData/actions'
import {
    getShoppingRequest,
    proceedToCheckout,
} from '../../../../libs/ShoppingRequest/actions'
import {
    selector_hasUserPermission,
    selector_defaultShippingAddress,
    selector_defaultBillingAddress,
    selector_isCES,
    selector_isLimitedUser,
} from '../../../../libs/User/selectors'
import {selector_shoppingRequestHasShippableItems} from '../../../LineLevel/selectors/additionalOrderInformation'
import {
    clearBillingAddNew,
    createBillingAddress,
    saveBillingAddressToShoppingRequest,
    selectBillingAddress,
} from '../../actions/billingAddressActions'
import {
    clearShippingAddNew,
    createShippingAddress,
    prop65Compliance,
    saveShippingAddressToShoppingRequest,
    selectShippingAddress,
} from '../../actions/shippingAddressActions'
import {getTaxAndEWRFee} from '../../actions/shippingOptionsActions'

import AddressSectionSimpleView from '../../components/AddressSectionSimple/AddressSectionSimpleView'
import {
    selector_addressSectionInitialValues,
    selector_allowSameAsShipping,
    selector_requireBillingAddressCreation,
    selector_requireShippingAddressCreation,
    selector_selectedBillingAddress,
    selector_selectedShippingAddress,
} from '../../selectors'
import {
    getDefaultShippingAddress,
    getDefaultBillingAddress,
} from '../../../../libs/User/actions'
import { selector_countryCode } from './../../../../libs/Insight/selectors'


function mapStateToProps(state, { type }) {
    const isShipping = type === 'shipping'

    const addressState = {
        defaultAddress: isShipping ? selector_defaultShippingAddress(state) : selector_defaultBillingAddress(state),
        requireAddressCreation: isShipping ? selector_requireShippingAddressCreation(state) : selector_requireBillingAddressCreation(state),
        selectedAddress: isShipping ? selector_selectedShippingAddress(state) : selector_selectedBillingAddress(state),
        sameAsShippingAddress: isShipping ? null : selector_selectedShippingAddress(state),
    }
    addressState.selectedAddress = normalizeToPurchaseOrderAddress(addressState.selectedAddress)
    addressState.defaultAddress = normalizeToPurchaseOrderAddress(addressState.defaultAddress)
    const initialValues = selector_addressSectionInitialValues(state, addressState.selectedAddress, { isShipping })

    const flags = {
        canEditAttentionFields: isShipping ? selector_hasUserPermission(state, 'ship_to_select') : selector_hasUserPermission(state, 'allow_bill_addr_change'),
        hideAttentionForm: isShipping ? false : !selector_hasUserPermission(state, 'allow_bill_addr_change'),
        shoppingRequestHasShippableitems: selector_shoppingRequestHasShippableItems(state),
        shouldFetchShoppingRequest: isShipping,
        showSameAsShipping: isShipping ? false : selector_allowSameAsShipping(state),
    }

    return {
        ...addressState,
        ...flags,
        cartItemsGAE: selector_cartItemsGAE(state),
        form: isShipping ? 'ShippingAddress' : 'BillingAddress',
        initialValues,
        isLimitedUser: selector_isLimitedUser(state),
        isOrderTemplate: selector_isOrderTemplate(state),
        isQuickCheckout: selector_isQuickCheckout(state),
        isSavedQuote: selector_isSavedQuote(state),
        isSimplifiedCESUser: selector_isLimitedUser(state) && selector_isCES(state),
        isShipping,
        messageBoxId: isShipping ? 'ShippingAddress' : 'BillingAddress',
        countryCode: selector_countryCode(state),
    }
}

function mapDispatchToProps(dispatch, { type }) {
    const isShipping = type === 'shipping'

    return bindActionCreators({
        clearAddNew: isShipping ? clearShippingAddNew : clearBillingAddNew,
        createAddress: isShipping ? createShippingAddress : createBillingAddress,
        fetchPopulateUIFlags,
        getShoppingRequest,
        getTaxAndEWRFee,
        proceedToCheckout,
        prop65Compliance,
        saveAddress: isShipping ? saveShippingAddressToShoppingRequest : saveBillingAddressToShoppingRequest,
        selectAddress: isShipping ? selectShippingAddress : selectBillingAddress,
        updateAddressDefault: isShipping ? updateShippingAddressDefault : updateBillingAddressDefault,
        getDefaultAddressOnAddressCreate: isShipping ? getDefaultShippingAddress : getDefaultBillingAddress,

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressSectionSimpleView)
