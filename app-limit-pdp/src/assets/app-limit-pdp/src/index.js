import React from 'react'
import { render } from 'react-dom'
import { Locale } from '@insight/toolkit-react'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { i18n } from '@insight/toolkit-utils/lib/labels'
import Routes from './routes'
import './scss/index.scss'

const locale = window.location.pathname.split("/")[2] || getCurrentLocale('insight_current_locale')

i18n({ app: 'app-product-details', locale }).then((labels) => {
  setToolkitLabels(labels)
  renderApp(Routes)
})

function renderApp() {
  const root = document.getElementById('react-app-limit-pdp')
  render(
    <Locale value={{ locale }}>
      <Routes />
    </Locale>,
    root
  )
}

if (module.hot) {
  module.hot.accept('./routes', renderApp)
}