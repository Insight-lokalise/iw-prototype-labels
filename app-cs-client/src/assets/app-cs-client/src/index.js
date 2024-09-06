import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import createStore from './state/createStore'
import { getInitialData } from './duck'
import { Locale } from '@insight/toolkit-react'
import { getInObject, getCurrentLocale } from '@insight/toolkit-utils'
import { BrowserRouter } from 'react-router-dom'

import './scss/index.scss'
import App from './App'

const store = createStore()
store.dispatch(getInitialData())
const locale = getCurrentLocale('insight_current_locale')
// this need to updated to read from API
const currencyCode = getInObject(window, ['Insight', 'userInformation', 'currencyCode'], 'USD')

function renderApp() {
  const root = document.getElementById('react-app-cs-client')
  render(
    <Provider store={store}>
      <Locale value={{ currencyCode, locale }}>
        <BrowserRouter basename="insightweb">
          <App locale={locale} />
        </BrowserRouter>
      </Locale>
    </Provider>,
    root
  )
}

renderApp()

if (module.hot) {
  module.hot.accept('./App', renderApp)
}
