import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ProductDetailsPage } from './components/ProductDetailsPage'
import { getCurrentLocale } from '@insight/toolkit-utils'

export default function RouteComponent() {
  const locale = getCurrentLocale('insight_locale')
  return (
    <BrowserRouter basename={`/${locale}/shop/`}>
      <Switch>
        <Route
          exact
          path="/product/:materialId/:brand/:mfrId/:desc"
          render={() => <ProductDetailsPage />}
        />
      </Switch>
    </BrowserRouter>
  )
}
