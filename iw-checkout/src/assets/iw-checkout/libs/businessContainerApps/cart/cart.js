import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
    selector_cart,
    selector_cartItemTentativeQuantities,
    selector_commoditiesMap,
    selector_cartTransfer,
    selector_isCloudCart,
    selector_numberOfItemsInCart,
    selector_shoppingCartHasErrorMessages,
    selector_hasLineLevelsInfoPopulated,
} from '../../Cart/selectors'

import {
    selector_ipsUser,
    selector_locale,
} from '../../Insight/selectors'

import {
    selector_hasUserPreferences,
    selector_isB2BUser,
    selector_isLoggedIn,
    selector_showProductImages,
    selector_user,
    selector_userRequiresApproval,
    selector_hasStockAndPriceDisplayDisabled
} from '../../User/selectors'

import {
    deleteFromCart,
    emptyCart,
    getCart,
    saveProrationUsageDate,
    splitItems,
    updateCartItemQuantities,
    updateItemQuantity,
    userInformation,
} from './actions'

import {addToReadOnlyFieldsMap, updateChildItems} from './actions/lineLevelFormActions'
import {
    selector_defaultCountryOfUsage,
    selector_defaultContactInformation,
    selector_hasMultipleLicenseInfoForms,
    selector_lineLevelFormNames,
} from './selectors'
import { setActiveIndex } from '../../../libs/iw-components/iw-accordion/actions'

import CartView from './components/cartView'


function mapStateToProps(state) {
    const lineLevelFormNames = selector_lineLevelFormNames(state)
    return {
        cart: selector_cart(state),
        cartItemTentativeQuantities: selector_cartItemTentativeQuantities(state),
        b2bCartTransferCommoditiesMap: selector_commoditiesMap(state),
        b2bUnspscCode: selector_cartTransfer(state).unspscVersion || '',
        defaultContactInformation: selector_defaultContactInformation(state),
        defaultCountryOfUsage: selector_defaultCountryOfUsage(state),
        hasMultipleLicenseInfoForms: selector_hasMultipleLicenseInfoForms(state),
        hasLineLevelsInfoPopulated: selector_hasLineLevelsInfoPopulated(state),
        hasUserPreferences: selector_hasUserPreferences(state),
        isStockAndPriceDisplayDisabled: selector_hasStockAndPriceDisplayDisabled(state),
        isB2BUser: selector_isB2BUser(state),
        ipsUser: selector_ipsUser(state),
        isLoggedIn: selector_isLoggedIn(state),
        isCloudCart: selector_isCloudCart(state),
        lineLevelFormNames,
        locale: selector_locale(state),
        numberOfItemsInCart: selector_numberOfItemsInCart(state),
        numberOfLineLevelForms: lineLevelFormNames.length,
        shoppingCartHasErrorMsgs: selector_shoppingCartHasErrorMessages(state),
        showProductImages: selector_showProductImages(state),
        userFromState: selector_user(state),
        userRequiresApproval: selector_userRequiresApproval(state),
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addToReadOnlyFieldsMap,
        deleteFromCart,
        emptyCart,
        getCart,
        saveProrationUsageDate,
        setActiveIndex,
        splitItems,
        updateCartItemQuantities,
        updateItemQuantity,
        userInformation,
        updateChildItems,
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(CartView)
