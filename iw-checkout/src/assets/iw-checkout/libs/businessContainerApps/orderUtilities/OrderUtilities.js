import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { selectEightHundredNumber } from './../../Insight/selectors'
import { selectTelephoneText, selectCurrencyFormat } from './../../InsightApplicationData/selectors'
import { exportCartAsXLS, togglePrintPreview } from './actions/orderUtilitiesActions'
import {
    selector_isPrintPreviewOpen,
    selector_cart,
    selector_numberOfItemsInCart,
    selector_transportsToDetermine,
    selector_cartItemsEnrollment
} from './../../Cart/selectors'
import { OrderUtilitiesView } from './OrderUtilitiesView'
import { selector_shoppingRequest } from './../../ShoppingRequest/selectors'
import {
    selector_hasAdditionalOrderInformation,
    selector_headerLevelSmartTrackers,
    selector_hasLabConfigurationNotes,
    selector_hasInvoiceNotes,
    selector_hasAdditionalOrderNotes,
    selector_hasFileUpload,
} from './../../../app/LineLevel/selectors'
import { selector_ipsUser } from './../../Insight/selectors'
import { submitEnrollmentValues } from '../../../libs/businessContainerApps/cart/actions'
import {
  selector_consortiaId,
  selector_hasUserPreferences,
  selector_isNavy,
  selector_isEMEA,
  selector_navySTName,
  selector_showProductImages
} from '../../../libs/User/selectors'
import { selector_isEnableCreditCardMessage } from "../../../app/messages/selectors"
import { creditCardMessage } from "../../../app/messages/CreditCardMessage"

function mapStateToProps(state) {
    return {
        applicationConfig: state.insightApplicationData,
        cart: selector_cart(state),
        consortiaID: selector_consortiaId(state),
        currencyFormat: selectCurrencyFormat(state),
        enrollmentInfo: selector_cartItemsEnrollment(state),
        hasLabConfigurationNotes: selector_hasLabConfigurationNotes(state),
        hasInvoiceNotes: selector_hasInvoiceNotes(state),
        hasAdditionalOrderNotes: selector_hasAdditionalOrderNotes(state),
        hasFileUpload: selector_hasFileUpload(state),
        hasAdditionalOrderInformation: selector_hasAdditionalOrderInformation(state),
        hasUserPreferences: selector_hasUserPreferences(state),
        headerLevelSmartTrackers: selector_headerLevelSmartTrackers(state),
        ipsUser: selector_ipsUser(state),
        isEMEA: selector_isEMEA(state),
        isPrintPreviewOpen: selector_isPrintPreviewOpen(state),
        isNavy: selector_isNavy(state),
        navySTName: selector_navySTName(state),
        numberOfItemsInCart: selector_numberOfItemsInCart(state),
        phoneNumberToDisplay: selectEightHundredNumber(state) || selectTelephoneText(state), //use custom number from Insight object first, otherwise use generic number from Toolkit
        shoppingRequest: selector_shoppingRequest(state),
        showProductImages: selector_showProductImages(state),
        transportsToDetermine: selector_transportsToDetermine(state),
        user: state.user,
        creditCardMessage: selector_isEnableCreditCardMessage(state) ? creditCardMessage : undefined,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        exportCartAsXLS,
        submitEnrollmentValues,
        togglePrintPreview,
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(OrderUtilitiesView)
