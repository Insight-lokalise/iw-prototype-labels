import React from 'react'
import { render } from 'react-dom'

import App from './components/App'
import './scss/index.scss'

function renderApp() {
	const root = document.getElementById('react-root')
	render(
		<App />,
		root
	)
}

renderApp()

if (module.hot) {
	module.hot.accept('./components/App', renderApp)
}
