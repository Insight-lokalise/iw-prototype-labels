import React from 'react'
import Cart from './../../libs/businessContainerApps/cart/cart'
import CartSummary from '../../libs/businessContainerApps/cartSummary/CartSummary'
import LegacyModals from './../ShoppingCart/components/legacyModals/LegacyModals'
import CheckoutButton from './../ShoppingCart/components/checkoutButton/CheckoutButton'
import PunchoutCart from './components/PunchoutCart/PunchoutCart'
import B2BReviewHeader from './components/B2BReviewHeader/B2BReviewHeader'
import CartPrintHeader from '../ShoppingCart/components/printPreview/CartPrintHeader'

export default function B2BTransfer(props) {
    return (
        <div>
            <LegacyModals />
            <div className="row expanded small-collapse large-uncollapse">
                <div className="columns">
                    <CartPrintHeader className="show-for-print hide-for-print-modal" />
                    <B2BReviewHeader />
                    <PunchoutCart />
                </div>
            </div>
            <div className="row expanded small-collapse large-uncollapse">
                <div className="columns print-cart-container small-12 large-9 print-12">
                    <div className="hide-for-medium">
                        <CartSummary isB2BTransfer >
                            <CheckoutButton history={props.history} isB2BTransfer />
                        </CartSummary>
                    </div>
                    <Cart className="cart" isB2BTransfer isReadOnly />
                </div>
                <div className='columns small-12 large-3' >
                    <div className="hide-for-small-only">
                        <CartSummary>
                            <CheckoutButton history={props.history} isB2BTransfer />
                        </CartSummary>
                    </div>
                </div>
            </div>
        </div>
    )
}
