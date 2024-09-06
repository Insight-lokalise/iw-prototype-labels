import React from 'react'
import { render } from 'react-dom'

import './scss/index.scss'
import Routes from './routes'

function renderApp() {
	const root = document.getElementById('react-client-management-reports-app')
	render(
    <Routes />,
		root
	)
}

renderApp()

if (module.hot) {
	module.hot.accept('./components/App', renderApp)
}
