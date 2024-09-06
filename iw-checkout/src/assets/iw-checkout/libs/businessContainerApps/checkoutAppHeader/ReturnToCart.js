import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { t } from '@insight/toolkit-utils/lib/labels'
import ROUTES from '../../routes'
import { getCart } from '../cart/actions'

function ReturnToCart(props) {
    const returnToCartText = 'Return to cart'
    return (
        <Link
            to={ROUTES.VIEW_CART}
            onClick={props.getCart}
            className="shopping-cart__header-link">
            {t(returnToCartText)}
            <span className="ion--right ion-ios-cart"></span>
        </Link>
    )
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCart,
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(ReturnToCart)
