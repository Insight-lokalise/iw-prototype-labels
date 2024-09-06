import { connect } from 'react-redux'

import {
    selector_hasInternationalCarrier,
} from '../../../ShipBillPay/selectors/shippingOptionsSelectors'
import { selector_p65Warnings } from '../../../ShipBillPay/selectors'
import { ReviewReceiptMessageHeaderView } from './ReviewReceiptMessageHeaderView'

function mapStateToProps(state) {
    return {
        hasInternationalCarrier: selector_hasInternationalCarrier(state),
        p65Warnings: selector_p65Warnings(state),
    }
}

export default connect(mapStateToProps, null)(ReviewReceiptMessageHeaderView)
