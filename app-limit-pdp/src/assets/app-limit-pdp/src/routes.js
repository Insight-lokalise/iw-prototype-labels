import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { LimitPDPPage } from './components/LimitPDPPage'

export default function RouteComponent() {
  return (
    <BrowserRouter basename='/insightweb'>
      <Switch>
        <Route
          exact
          path="/:locale/products/*"
          render={() => <LimitPDPPage />}
        />
      </Switch>
    </BrowserRouter>
  )
}
