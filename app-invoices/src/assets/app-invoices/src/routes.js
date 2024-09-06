import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { BREADCRUMBS, ROUTES } from '@constants'
import { InvoicesPage } from './components/InvoicesPage/InvoicesPage'
import { InvoiceDetailsPage } from './components/InvoiceDetailsPage/InvoiceDetailsPage'
import Breadcrumb from './components/Breadcrumb'

/** Have to try with react-router-dom version 6 **/
export default function RouteComponent() {
  const components = {
    INVOICE_HISTORY: <InvoicesPage />,
    INVOICE_DETAIL: <InvoiceDetailsPage />,
  }
  return (
    <div>
      <BrowserRouter basename="/insightweb">
        <Switch>
          {Object.keys(ROUTES).map((name, key) => (
            <Route
              exact
              path={ROUTES[name].url}
              key={key}
              render={(props) => (
                <React.Fragment>
                  <Breadcrumb
                    breadcrumb={BREADCRUMBS[name]}
                    routeName={ROUTES[name].name}
                    key={key}
                    {...props}
                  />
                  {components[name]}
                </React.Fragment>
              )}
            />
          ))}
        </Switch>
      </BrowserRouter>
    </div>
  )
}
