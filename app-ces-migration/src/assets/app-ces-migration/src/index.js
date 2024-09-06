import React from 'react'
import { render } from 'react-dom'

import Migrator from './components/Migrator'
import './scss/index.scss'

function renderApp() {
	const root = document.getElementById('react-ces-migration-app')
	render(
		<Migrator />,
		root
	)
}

renderApp()

if (module.hot) {
	module.hot.accept('./components/App', renderApp)
}
