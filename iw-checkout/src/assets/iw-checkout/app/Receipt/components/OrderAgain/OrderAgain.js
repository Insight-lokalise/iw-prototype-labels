import { connect } from 'react-redux'

import {
    selector_isCloudCart,
} from '../../../../libs/Cart/selectors'
import {
    selector_hasUserPermission,
} from '../../../../libs/User/selectors'
import { userPermissions } from '../../../../libs/User/permissions'
import { duplicateOrder } from '../../../../libs/models/DuplicateOrder/duplicateOrder'
import OrderAgainView from './OrderAgainView'


function mapStateToProps(state) {
    return {
        duplicateOrder: duplicateOrder,        
        isCloudCart: selector_isCloudCart(state),
        hasDuplicateOrderPermission: selector_hasUserPermission(state, userPermissions.ENABLE_DUPLICATE_ORDER),
    }
}

export default connect(mapStateToProps, null)(OrderAgainView)
