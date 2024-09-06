import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ErrorBoundary } from '@components'
import { useDisplay, usePurpose } from '@context'
import { Builder, Landing, List } from '@pages/pages'

export default function Routes() {
    const display = useDisplay()
    const purpose = usePurpose()

    const renderComponent = (Component, props) => (
        <Component
            display={display}
            purpose={purpose}
            {...props}
        />
    )

    return (
        <BrowserRouter>
            <div className="c-app-views">
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={props => renderComponent(Landing, props)}
                    />
                    <Route
                        exact
                        path="/builder"
                        render={props => renderComponent(Builder, props)}
                    />
                    <Route
                        exact
                        path="/list"
                        render={props => renderComponent(List, props)}
                    />
                </Switch>
            </div>
        </BrowserRouter>
    )
}