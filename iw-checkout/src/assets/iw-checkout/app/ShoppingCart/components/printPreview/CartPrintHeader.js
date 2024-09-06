import { connect } from 'react-redux'

import { selectEightHundredNumber } from './../../../../libs/Insight/selectors'
import { selectTelephoneText } from './../../../../libs/InsightApplicationData/selectors'
import CartPrintHeaderView from './../printPreview/CartPrintHeaderView'
import { togglePrintPreview } from './../../../../libs/businessContainerApps/orderUtilities/actions/orderUtilitiesActions'
import {
    selector_isLoggedIn,
    selector_webLoginProfile,
    selector_defaultShippingAddress,
} from './../../../../libs/User/selectors'

const mapStateToProps = (state) => {
    return {
        isLoggedIn: selector_isLoggedIn(state),
        webLoginProfile: selector_webLoginProfile(state),
        defaultShippingAddress: selector_defaultShippingAddress(state),
        phoneNumberToDisplay: selectEightHundredNumber(state) || selectTelephoneText(state), //use custom number from Insight object first, otherwise use generic number from Toolkit
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        togglePrintPreview(isOpen) {
            dispatch(togglePrintPreview(isOpen))
        },
        onPrint() {
            window.print()
            window.onafterprint = () => dispatch(togglePrintPreview(false))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPrintHeaderView)
