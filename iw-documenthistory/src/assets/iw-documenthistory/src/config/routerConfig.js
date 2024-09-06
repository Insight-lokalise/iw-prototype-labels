import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { ROUTES, BREADCRUMBS } from './routes'
import ScrollToTop from './../Shared/components/ScrollToTop/ScrollToTop'
import OrderSearch from './../Orders/Search/Search'
import OrderDetails from './../Orders/Details/containers/OrderDetails/OrderDetails'
import Breadcrumb from "./Breadcrumb";


export default function Routes({isCES}) {
  const components = {
    ORDER_TRACKING: <OrderSearch />,
    ORDER_HISTORY: <OrderSearch />,
    LOGGED_IN_ORDER_DETAILS: <OrderDetails />,
    LOGGED_OUT_ORDER_DETAILS: <OrderDetails />
  }

  return (
    <BrowserRouter basename="insightweb">
      <div className="iw-styles iw-documenthistory">
        {/* Scroll to the top of the page on every route change */}
        <Route render={ScrollToTop} />
        <Switch>
          {Object.keys(ROUTES).map ((name, key) => (
            <Route
              exact
              path={ROUTES[name].url}
              key={key}
              render={(props) => {
                return (
                  <>
                    {isCES && <Breadcrumb breadcrumb={BREADCRUMBS[name]} routeName={ROUTES[name].name} key={key} {...props} />}
                    {components[name]}
                  </>
                )
              }}
            />
          ))}
        </Switch>
      </div>
    </BrowserRouter>
  )
}
