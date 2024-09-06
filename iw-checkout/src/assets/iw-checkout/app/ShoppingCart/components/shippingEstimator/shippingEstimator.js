import React from 'react'
import { updateShippingCarrier, getShippingEstimate, openShippingOptionsDialog } from './../../actions/shippingEstimatorActions'
import { connect } from 'react-redux'
import { getShipEstimate as getShipEstimateFromState, cartHasShippableItems } from './../../../../libs/Cart/selectors'
import { selector_insight } from './../../../../libs/Insight/selectors'
import { selector_user } from './../../../../libs/User/selectors'
import ShippingEstimatorView from './shippingEstimatorView'
import { ShowIf } from './../../../../libs/higherOrderComponents/showIf'

const ShippingEstimator = (props) =>{
    return (
        <ShowIf test={props.cartHasShippableItems && shouldShowShippingEstimator}>
            <ShippingEstimatorView {...props}/>
        </ShowIf>
    )
}

function mapStateToProps(state) {
    return {
        shippingEstimator: getShipEstimateFromState(state),
        cartHasShippableItems: cartHasShippableItems(state),
        insightFromState: selector_insight(state),
        userFromState: selector_user(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getShipEstimate(zipcode) {
            dispatch(getShippingEstimate(zipcode))
        },
        updateShipCarrier(option) {
            dispatch(updateShippingCarrier(option))
            dispatch(openShippingOptionsDialog(false))
        },
        closeDialog() {
            dispatch(openShippingOptionsDialog(false))
        },
    }
}

/**
 *
 * @param  {Object} props   props passed to the showIf component
 * @return {Boolean}       should we render?
 */
function shouldShowShippingEstimator(props) {
    const { reduxState } = props
    const permissions = ['frt_estimator']
    const webGroupHasPermission = permission => reduxState.webGroupPermissions.includes(permission)
    return !reduxState.isLoggedIn || (reduxState.isLoggedIn && permissions.filter(webGroupHasPermission).length === permissions.length)
}

export default connect(mapStateToProps, mapDispatchToProps)(ShippingEstimator)
