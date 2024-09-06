import React from 'react'
import { connect } from 'react-redux'
import { addToQuickShop, addToQuickShopFromModal } from './../../actions/quickShopActions'
import { getQuickShop as getQuickShopFromState, selector_cart } from './../../../../libs/Cart/selectors'

import QuickShopView from './quickShopView'

const QuickShop = (props) => <QuickShopView {...props} />

function mapStateToProps(state) {
    return {
        quickShop: getQuickShopFromState(state),
        cart: selector_cart(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addToQuickShop(materialId, quantity) {
            dispatch(addToQuickShop(materialId, quantity))
        },
        updateToCart(items, quantity) {
            dispatch(addToQuickShopFromModal(items, quantity))
        },
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(QuickShop)
