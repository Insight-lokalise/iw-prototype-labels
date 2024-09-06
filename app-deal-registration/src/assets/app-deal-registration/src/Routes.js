import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { ErrorBus } from '@components'
import { useDisplay, useErrors, useEvents, usePurpose } from '@context'
import {
	AccessDenied,
	Admin,
	Builder,
	Edit,
	Landing,
	List,
	Preview,
	Submission
} from './pages'

export default function Routes() {
	const display = useDisplay()
	const { currentError, setCurrentError: setAppError } = useErrors()
	const events = useEvents()
	const purpose = usePurpose()
	const renderRoute = (PassedComponent, props) => {
		return <PassedComponent display={display} emitter={events} purpose={purpose} {...props} />
	}

	return (
		<div className="c-app-views">
			<ErrorBus currentError={currentError} display={display} events={events} setAppError={setAppError} />
			{!currentError && (
				<Switch>
					<Route exact path="/" render={props => renderRoute(Landing, props)} />
					<Route exact path="/access-denied" render={props => renderRoute(AccessDenied, props)} />
					<Route exact path="/admin" render={props => renderRoute(Admin, props)} />
					<Route exact path="/builder" render={props => renderRoute(Builder, props)} />
					<Route exact path="/edit" render={props => renderRoute(Edit, props)} />
					<Route exact path="/list" render={props => renderRoute(List, props)} />
					<Route exact path="/preview" render={props => renderRoute(Preview, props)} />
					<Route exact={false} path="/submission" render={props => renderRoute(Submission, props)} />
				</Switch>
			)}
		</div>
	)
}
