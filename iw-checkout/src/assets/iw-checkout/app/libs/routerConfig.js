import React from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'

import CheckoutAppHeader from '../../libs/businessContainerApps/checkoutAppHeader/CheckoutAppHeader'
import ShoppingCart from '../ShoppingCart/ShoppingCart'
import ShipBillPay from '../ShipBillPay/ShipBillPay'
import LineLevel from '../LineLevel/LineLevel'
import Review from '../Review/Review'
import Receipt from '../Receipt/Receipt'
import B2BReview from './../B2BReview/B2BReview'
import ROUTES from '../../libs/routes'
import ScrollToTop from '../../libs/routes/ScrollToTop'
import Breadcrumb from "./Breadcrumb";
import ProcessOrder from '../Review/ProcessOrder'

export function Routes({isCES}) {
    return (
        <BrowserRouter basename='insightweb'>
            <div className='cart-container'>
                { isCES && <Breadcrumb /> }
                <CheckoutAppHeader/>
                <Route render={ScrollToTop} />
                <Switch>
                    <Route
                      path={ROUTES.VIEW_CART}
                      component={ShoppingCart}>

                    </Route>
                    <Route path={ROUTES.LINE_LEVEL} component={LineLevel}></Route>
                    <Route path={ROUTES.SHIP_BILL_PAY} component={ShipBillPay}></Route>
                    <Route path={ROUTES.PLACE_ORDER} component={Review}></Route>
                    <Route path={ROUTES.RECEIPT} component={Receipt}></Route>
                    <Route path={ROUTES.CART_TRANSFER} component={B2BReview}></Route>
                    <Route path={ROUTES.PROCESS_ORDER} component={ProcessOrder}></Route>
                </Switch>
            </div>
        </BrowserRouter>
    )
}
