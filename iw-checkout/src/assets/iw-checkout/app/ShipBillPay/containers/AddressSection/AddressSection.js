import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
    selector_cartItemsGAE,
    selector_isOrderTemplate,
    selector_isSavedQuote,
} from '../../../../libs/Cart/selectors/cartResponse'
import {selector_isQuickCheckout} from '../../../../libs/Cart/selectors/shoppingCartView'
import {
    selector_populateUIFlags,
    selector_isSingleSoldTo,
} from '../../../LineLevel/selectors'
import {
    updateBillingAddressDefault,
    updateShippingAddressDefault,
} from '../../actions'

import {normalizeToPurchaseOrderAddress} from './../../../../libs/models/Address/address'
import {fetchPopulateUIFlags} from './../../../../libs/OrderMetaData/actions'
import {
    getShoppingRequest,
    proceedToCheckout,
} from './../../../../libs/ShoppingRequest/actions'
import {
    selector_hasUserPermission,
    selector_isAPAC,
    selector_userSalesOrg,
    selector_defaultShippingAddress,
    selector_defaultBillingAddress,
    selector_isLimitedUser,
    selector_isEMEA,
} from './../../../../libs/User/selectors'
import {selector_shoppingRequestHasShippableItems} from './../../../LineLevel/selectors/additionalOrderInformation'
import {
    clearBillingAddNew,
    createBillingAddress,
    getFavoriteBillingAddresses,
    sameAsShipping,
    saveBillingAddressToShoppingRequest,
    selectBillingAddress,
} from './../../actions/billingAddressActions'
import {
    clearShippingAddNew,
    createShippingAddress,
    getFavoriteShippingAddresses,
    prop65Compliance,
    saveShippingAddressToShoppingRequest,
    selectShippingAddress,
} from './../../actions/shippingAddressActions'
import {getTaxAndEWRFee} from './../../actions/shippingOptionsActions'

import AddressSection from './../../components/AddressSection/AddressSectionView'
import {
    selector_addressSectionInitialValues,
    selector_allowSameAsShipping,
    selector_requireBillingAddressCreation,
    selector_requireShippingAddressCreation,
    selector_selectedBillingAddress,
    selector_selectedShippingAddress,
} from './../../selectors'
import {
    getDefaultShippingAddress,
    getDefaultBillingAddress,
} from './../../../../libs/User/actions'


function mapStateToProps(state, { type }) {
    const isShipping = type === 'shipping'

    const addressState = {
        defaultAddress: isShipping ? selector_defaultShippingAddress(state) : selector_defaultBillingAddress(state),
        requireAddressCreation: isShipping ? selector_requireShippingAddressCreation(state) : selector_requireBillingAddressCreation(state),
        selectedAddress: isShipping ? selector_selectedShippingAddress(state) : selector_selectedBillingAddress(state),
    }
    addressState.selectedAddress = normalizeToPurchaseOrderAddress(addressState.selectedAddress)
    addressState.defaultAddress = normalizeToPurchaseOrderAddress(addressState.defaultAddress)
    const initialValues = selector_addressSectionInitialValues(state, addressState.selectedAddress, { isShipping })

    const flags = {
        canEditAttentionFields: isShipping ? selector_hasUserPermission(state, 'ship_to_select') : selector_hasUserPermission(state, 'allow_bill_addr_change'),
        //disable country select for shipping address in Canada or billing address in EMEA
        disableCountrySelect: isShipping && isFromCanada(selector_userSalesOrg(state)) || !isShipping && selector_isEMEA(state),
        hideAttentionForm: isShipping ? false : !selector_hasUserPermission(state, 'allow_bill_addr_change'),
        isEMEA: selector_isEMEA(state),
        isAPAC: selector_isAPAC(state),
        isEditChkoutDefaultFavs: selector_hasUserPermission(state, 'edit_chkout_default_favs'),
        requireAttentionLine: isShipping ? selector_hasUserPermission(state, 'force_ship_attention_line') : selector_hasUserPermission(state, 'force_bill_attention_line'),
        shoppingRequestHasShippableitems: selector_shoppingRequestHasShippableItems(state),
        shouldFetchShoppingRequest: isShipping,
        showAddNewLink: isShipping ? selector_hasUserPermission(state, 'ship_to_in_sap') : selector_hasUserPermission(state, 'bill_to_on_fly'),
        showPrivateShipTo: isShipping && (selector_hasUserPermission(state, 'private_shipto_allow') && !selector_populateUIFlags(state).privateShipTo),
        showSameAsShipping: isShipping ? false : selector_allowSameAsShipping(state),
        showStoredAddressLink: isShipping ? selector_hasUserPermission(state, 'change_ship_to') : selector_hasUserPermission(state, 'bill_to_select'),
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
        isShipping,
        isSingleSoldTo: selector_isSingleSoldTo(state),
        messageBoxId: isShipping ? 'ShippingAddress' : 'BillingAddress',
    }
}

function isFromCanada(salesOrg) {
    return salesOrg === '4100'
}

function mapDispatchToProps(dispatch, { type }) {
    const isShipping = type === 'shipping'

    return bindActionCreators({
        clearAddNew: isShipping ? clearShippingAddNew : clearBillingAddNew,
        createAddress: isShipping ? createShippingAddress : createBillingAddress,
        fetchPopulateUIFlags,
        getFavoriteAddresses: isShipping ? getFavoriteShippingAddresses : getFavoriteBillingAddresses,
        getShoppingRequest,
        getTaxAndEWRFee,
        proceedToCheckout,
        prop65Compliance,
        sameAsShipping,
        saveAddress: isShipping ? saveShippingAddressToShoppingRequest : saveBillingAddressToShoppingRequest,
        selectAddress: isShipping ? selectShippingAddress : selectBillingAddress,
        updateAddressDefault: isShipping ? updateShippingAddressDefault : updateBillingAddressDefault,
        getDefaultAddressOnAddressCreate: isShipping ? getDefaultShippingAddress : getDefaultBillingAddress,

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressSection)
