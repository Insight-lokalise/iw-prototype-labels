import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import App from './containers/AppContainer'

export default function RouterComponent() {
	return (
		<div>
			<BrowserRouter>
				<div>
					<Route exact path="/" component={App} />
				</div>
			</BrowserRouter>
		</div>
	)
}
