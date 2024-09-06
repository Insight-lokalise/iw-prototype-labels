import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ROUTES, ROUTE_MAPS } from './constants';
import ScrollToTop from './lib/ScrollToTop';
import ReportingManagement from './components/ReportingManagement';

const components = {
  [ROUTE_MAPS.REPORTING_LANDING]: <ReportingManagement />,
}

export default function RouteComponent() {
	return (
    <BrowserRouter basename='/insightweb'>
      <div className='c-reporting'>
        <Route render={ScrollToTop} />
        <Switch>
          {Object.keys(ROUTES).map((name, key) => {
            return (
              <Route
                exact
                path={ROUTES[name].url}
                key={key}
                render={() => components[name]}
              />
            )
          })}
        </Switch>
      </div>
    </BrowserRouter>
	)
}
