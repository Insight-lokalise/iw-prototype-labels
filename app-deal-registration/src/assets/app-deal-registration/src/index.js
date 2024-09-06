import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { IS_DEV } from 'lib'
import { createStore } from 'state'

import App from './App'

import './scss/index.scss';

const store = createStore()

function renderApp() {
	const root = document.getElementById('app-deal-registration')
	render(
		<Provider store={store}>
			<App />
		</Provider>,
		root
	)
}

renderApp()

if (IS_DEV) {
	const { whyDidYouUpdate } = require('why-did-you-update')
	whyDidYouUpdate(React)
}

if (module.hot) {
	module.hot.accept('./App', renderApp)
}
