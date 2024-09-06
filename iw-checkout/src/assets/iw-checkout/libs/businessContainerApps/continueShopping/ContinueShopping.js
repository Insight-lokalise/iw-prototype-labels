import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
    selector_hasSoftwareContracts,
    selector_isCloudCart,
} from '../../Cart/selectors'
import {
    selector_hasQuickFormsPermission,
    selector_hasSoftwareContractSearchPermission,
    selector_userHomePageURL,
    selector_hasUserPermission,
} from '../../User/selectors'
import { userPermissions } from '../../User/permissions'
import { selector_locale, selector_userInformation } from '../../Insight/selectors'

import ContinueShoppingView from './ContinueShoppingView'
import { duplicateOrder } from '../../models/DuplicateOrder/duplicateOrder'


function mapStateToProps(state) {
    return {
        duplicateOrder: duplicateOrder,
        hasSoftwareContracts: selector_hasSoftwareContracts(state),
        hasSoftwareContractSearchPermission: selector_hasSoftwareContractSearchPermission(state),
        hasQuickFormsPermission: selector_hasQuickFormsPermission(state),
        locale: selector_locale(state),
        userHomePageURL: selector_userHomePageURL(state),
        isCloudCart: selector_isCloudCart(state),
        hasDuplicateOrderPermission: selector_hasUserPermission(state, userPermissions.ENABLE_DUPLICATE_ORDER),
        userInformation: selector_userInformation(state),
    }
}

export default connect(mapStateToProps, null)(ContinueShoppingView)
