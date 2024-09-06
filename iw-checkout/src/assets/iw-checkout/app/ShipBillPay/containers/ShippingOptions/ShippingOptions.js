import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
    change,
    change as clearSetAsMyDefault,
} from 'redux-form'
import {
    getShoppingRequest,
    proceedToCheckout,
} from './../../../../libs/ShoppingRequest/actions'
import {selector_shoppingRequestShipping} from './../../../../libs/ShoppingRequest/selectors'
import {
  selector_b2bLoginInfo,
  selector_hasStockAndPriceDisplayDisabled,
  selector_hasUserPermission,
  selector_isEMEA,
} from './../../../../libs/User/selectors'
import {triggerTransferCartAfterGetCart} from './../../../ShoppingCart/actions/cartB2BTransferActions'
import {validateReviewOrder} from './../../actions/paymentActions'
import {
    getShippingCarriers,
    getTaxAndEWRFee,
    getThirdPartyCarriers,
    saveCarrierToShoppingRequest,
    updateCarrierDefault,
} from './../../actions/shippingOptionsActions'

import ShippingOptionsView from './../../components/ShippingOptions/ShippingOptionsView'
import {
    selector_billMyCarrier,
    selector_hasValidQtyForShipComplete,
    selector_selectedShippingOption,
    selector_shippingCarriers,
    selector_shippingOptionsInitialValues,
    selector_thirdPartyCarriers,
} from './../../selectors/shippingOptionsSelectors'
import {selector_hasTaxOverride, selector_taxExemptionNumber} from "../../../LineLevel/selectors";
import { updateTaxExemption, getTaxExemptFromShoppingRequest } from './../../actions'

function mapStateToProps(state) {
    const b2bProps = {
        eProcType: selector_b2bLoginInfo(state).eProcType,
        extrinsic: selector_b2bLoginInfo(state).extrinsic,
        token: selector_b2bLoginInfo(state).token,
    }
    return {
        b2bProps,
        billMyCarrier: selector_billMyCarrier(state),
        canSaveASNEmails: selector_hasUserPermission(state, 'advance_shipment_notification'),
        canShowThirdPartyCarrier: selector_hasUserPermission(state, 'carrier_account_no'),
        forceThirdPartyCarrier: selector_hasUserPermission(state, 'force_carrier_account'),
        hasValidQtyForShipComplete: selector_hasValidQtyForShipComplete(state),
        hasTaxOverride: selector_hasTaxOverride(state),
        initialValues: selector_shippingOptionsInitialValues(state),
        isVASEnabled: selector_hasUserPermission(state, 'value_added_services'),
        selectedShipping: selector_shoppingRequestShipping(state),
        selectedShippingOption: selector_selectedShippingOption(state),
        shippingCarriers: selector_shippingCarriers(state),
        thirdPartyCarriers: selector_thirdPartyCarriers(state),
        taxExemptionNumber: selector_taxExemptionNumber(state),
        isEMEA: selector_isEMEA(state),
        isStockAndPriceDisplayDisabled: selector_hasStockAndPriceDisplayDisabled(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clearSetAsMyDefault,
        getShippingCarriers,
        getShoppingRequest,
        getTaxExemptFromShoppingRequest,
        getTaxAndEWRFee,
        getThirdPartyCarriers,
        proceedToCheckout,
        removeCarrierSelection: change.bind(null, 'ShippingOptions', 'carrierOption', ''),
        saveCarrierToShoppingRequest,
        triggerTransferCartAfterGetCart,
        updateCarrierDefault,
        updateTaxExemption,
        validateReviewOrder,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ShippingOptionsView)
