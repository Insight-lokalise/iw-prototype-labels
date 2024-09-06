import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import React, {Component} from 'react'

import CheckoutButtonView from './CheckoutButtonView'
import {
    action_saveRequestorGroupId,
    saveSPLAUsage,
    setHasSavedRequestorGroupAutomatically,
} from '../../../../libs/businessContainerApps/cartSummary/actions/cartSummaryActions'
import { setQuickCheckout, submitEnrollmentValues } from '../../../../libs/businessContainerApps/cart/actions'
import { getRequestorGroups } from '../../../../libs/User/actions'
import { fetchTransferCart, setIsB2BTransferPage } from '../../actions/cartB2BTransferActions'
import { getShoppingRequest, proceedToCheckout } from './../../../../libs/ShoppingRequest/actions'
import { fetchPopulateUIFlags } from './../../../../libs/OrderMetaData/actions'
import { selector_userInformation } from '../../../../libs/Insight/selectors'
import {
    selector_cartItemsEnrollment,
    selector_haltUserProgressFromCart,
    selector_hasSavedRequestorGroup,
    selector_isCartPending,
} from '../../../../libs/Cart/selectors'
import {
    selector_b2bLoginInfo,
    selector_freightTax,
	selector_isB2BUser,
    selector_isLoggedIn,
    selector_numberOfRequestorGroups,
    selector_onlyRequestorGroup,
    selector_userRequestorGroups,
    selector_userRequiresApproval,
    selector_userHasOneRequestorGroup,
    selector_isLimitedUser,
} from '../../../../libs/User/selectors'
import { setActiveIndex } from './../../../../libs/iw-components/iw-accordion/actions'
import { selector_taxIsPending } from './../../../../libs/ShoppingRequest/selectors'

import { selectSPLADetails, selectUsageReporting } from '../../../../libs/Cart/selectors/usageReportingSelector'
import { triggerTransferCartAfterGetCart } from '../../../ShoppingCart/actions/cartB2BTransferActions'
import { selector_cartItemsGAE } from '../../../../libs/Cart/selectors/cartResponse'

const mapStateToProps = (state) => {
    const hasSavedRequestorGroup = selector_hasSavedRequestorGroup(state)
    const b2bProps = {
        eProcType: selector_b2bLoginInfo(state).eProcType,
        extrinsic: selector_b2bLoginInfo(state).extrinsic,
        token: selector_b2bLoginInfo(state).token,
    }
    return {
        automaticallySaveRequestorGroup: !hasSavedRequestorGroup && selector_userHasOneRequestorGroup(state),
        b2bLoginInfo: selector_b2bLoginInfo(state),
        b2bProps,
        enrollmentInfo: selector_cartItemsEnrollment(state),
        freightTax: selector_freightTax(state),
        haltUserProgressFromCart: selector_haltUserProgressFromCart(state),
        hasSavedRequestorGroup: hasSavedRequestorGroup,
        isB2BUser: selector_isB2BUser(state),
        isLoggedIn: selector_isLoggedIn(state),
        isUsagePeriodReportableCart: selectSPLADetails(state).hasUsageReportableSoftware,
        numberOfRequestorGroups: selector_numberOfRequestorGroups(state),
        onlyRequestorGroup: selector_onlyRequestorGroup(state),
        usageReportingHistory: selectUsageReporting(state),
        userInformation: selector_userInformation(state),
        userRequestorGroups: selector_userRequestorGroups(state),
        userRequiresApproval: selector_userRequiresApproval(state),
        isCartPending: selector_isCartPending(state),
        taxIsPending: selector_taxIsPending(state),
        cartItemsGAE: selector_cartItemsGAE(state),
        isLimitedUser: selector_isLimitedUser(state),
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        action_saveRequestorGroupId,
        fetchTransferCart,
        getRequestorGroups,
        saveSPLAUsage,
        setIsB2BTransferPage,
        submitEnrollmentValues,
        getShoppingRequest,
        fetchPopulateUIFlags,
        proceedToCheckout,
        setActiveIndex,
        setHasSavedRequestorGroupAutomatically,
        triggerTransferCartAfterGetCart,
        setQuickCheckout,
    }, dispatch)
}

class CheckoutButton extends Component {
    constructor() {
        super()
        this.state = {
            hasSavedRequestorGroupAutomatically: false,
        }
    }

    componentDidMount() {
        if (this.props.userRequiresApproval) {
            this.props.getRequestorGroups()
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.automaticallySaveRequestorGroup && !prevState.hasSavedRequestorGroupAutomatically && !nextProps.isCartPending) {
            return {hasSavedRequestorGroupAutomatically : true}
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.hasSavedRequestorGroupAutomatically !== prevState.hasSavedRequestorGroupAutomatically) {
            if (this.props.automaticallySaveRequestorGroup && this.state.hasSavedRequestorGroupAutomatically) {
                this.props.action_saveRequestorGroupId(
                    this.props.onlyRequestorGroup.requestorGroupId,
                    this.props.onlyRequestorGroup.requestorGroupName
                )
                this.props.setHasSavedRequestorGroupAutomatically()
            }
        }
    }

    shouldRenderButton = () => {
        return !(this.props.quickCheckout && (this.props.isB2BUser || this.props.isLimitedUser))
    };

    render() {
        return (
            this.shouldRenderButton() &&
            <CheckoutButtonView { ...this.props } />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutButton)


CheckoutButton.propTypes = {
    quickCheckout: PropTypes.bool.isRequired,
    action_saveRequestorGroupId: PropTypes.func,
    fetchTransferCart: PropTypes.func,
    getRequestorGroups: PropTypes.func,
    saveSPLAUsage: PropTypes.func,
    setIsB2BTransferPage: PropTypes.func,
    getShoppingRequest: PropTypes.func,
    fetchPopulateUIFlags: PropTypes.func,
    proceedToCheckout: PropTypes.func.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    setHasSavedRequestorGroupAutomatically: PropTypes.func,
    setIsLoading: PropTypes.func,
    triggerTransferCartAfterGetCart: PropTypes.func,
    setQuickCheckout: PropTypes.func.isRequired,

    automaticallySaveRequestorGroup: PropTypes.bool,
    b2bLoginInfo: PropTypes.object,
    b2bProps: PropTypes.object,
    freightTax: PropTypes.bool,
    haltUserProgressFromCart: PropTypes.bool,
    hasSavedRequestorGroup: PropTypes.bool,
    isB2BUser: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isLoading: PropTypes.bool,
    isUsagePeriodReportableCart: PropTypes.bool,
    numberOfRequestorGroups: PropTypes.number,
    onlyRequestorGroup: PropTypes.object,
    usageReportingHistory: PropTypes.object,
    userInformation: PropTypes.object,
    userRequiresApproval: PropTypes.bool,
    isCartPending: PropTypes.bool,
    taxIsPending: PropTypes.bool,
}

CheckoutButton.defaultProps = {
    quickCheckout: false,
}