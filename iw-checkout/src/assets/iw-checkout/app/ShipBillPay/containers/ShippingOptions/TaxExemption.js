import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
    getShoppingRequest,
    proceedToCheckout,
} from './../../../../libs/ShoppingRequest/actions'
import {
    selector_isEMEA,
} from './../../../../libs/User/selectors'
import {validateReviewOrder} from './../../actions/paymentActions'
import {
    getTaxAndEWRFee,
} from './../../actions/shippingOptionsActions'

import TaxExemptionView from './../../components/ShippingOptions/TaxExemptionView'
import {selector_hasTaxOverride, selector_taxExemptionNumber} from "../../../LineLevel/selectors";
import { updateTaxExemption, getTaxExemptFromShoppingRequest } from './../../actions'

function mapStateToProps(state) {
    return {
        hasTaxOverride: selector_hasTaxOverride(state),
        taxExemptionNumber: selector_taxExemptionNumber(state),
        isEMEA: selector_isEMEA(state),
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getShoppingRequest,
        getTaxExemptFromShoppingRequest,
        getTaxAndEWRFee,
        proceedToCheckout,
        updateTaxExemption,
        validateReviewOrder,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaxExemptionView)
