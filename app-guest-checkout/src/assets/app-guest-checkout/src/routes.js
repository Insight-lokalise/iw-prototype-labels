import React, { Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@constants'

import CustomerInfo from './components/CustomerInfo/CustomerInfo'
import { GuestCheckoutHeader } from './components/GuestCheckoutHeader'
import OrderItemInfo from './components/OrderAndItemInfo/OrderItemInfo'
import ShoppingInfo from './components/ShoppingInfo/ShoppingInfo'
import ShoppingCart from "./components/ShoppingCart/ShoppingCart"
import ReviewOrder from "./components/ReviewOrder/ReviewOrder";
import ProcessOrder from "./components/ProcessOrder/ProcessOrder"
import Receipt from "./components/Receipt/Receipt"
import MessageComponent from './components/PageMessages/MessageComponent';

const components = {
  CART: <ShoppingCart />,
  CUSTOMER_INFO: <CustomerInfo />,
  ITEM_INFO: <OrderItemInfo />,
  SHOPPING_INFO: <ShoppingInfo />,
  REVIEW: <ReviewOrder />,
  RECEIPT: <Receipt />, // refactor to ideal component
  PROCESS: <ProcessOrder />,
}

export default function RouterComponent() {
  return (
    <BrowserRouter basename="/insightweb">
      <div className="guest-container o-wrapper-large">
        <GuestCheckoutHeader />
        <Switch>
          {Object.keys(ROUTES).map((name, key) => (
            <Route
              path={ ROUTES[name].url + "(#.*)?" }
              key={key}
              render={() => (
                <Fragment>
                  {/*  checkout steps component can be rendered here */}
                  {<MessageComponent />}
                  {components[name]}
                </Fragment>
              )}
            />
          ))}
        </Switch>
      </div>
    </BrowserRouter>
  )
}
