import React from 'react'
import { render } from 'react-dom'
import { getTranslations } from 'api'
import { getCurrentLocale } from '@insight/toolkit-utils'

import App from './App'
import './scss/index.scss'

const localeValue = getCurrentLocale('insight_current_locale','insight_locale')

function renderApp() {
  const root = document.getElementById('app-terms-conditions')
  render(
    <App />,
    root
  )
}

Promise.resolve(getTranslations(localeValue)).then(() => {
  renderApp()
})


if (module.hot) {
  module.hot.accept('./Routes', renderApp)
}
