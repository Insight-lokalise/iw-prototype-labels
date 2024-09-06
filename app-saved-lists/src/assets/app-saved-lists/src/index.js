import React from 'react'
import { render } from 'react-dom'
import { Locale } from '@insight/toolkit-react'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { getCurrentLocale } from '@insight/toolkit-utils'
import { i18n } from '@insight/toolkit-utils/lib/labels'
import Routes from './routes'
import { SessionContextProvider } from './context/SessionContext'
import './scss/index.scss'

const locale = getCurrentLocale('insight_current_locale')

i18n({ app: 'app-stored-carts', locale }).then((labels) => {
  setToolkitLabels(labels)
  renderApp(Routes)
})

if ('scrollRestoration' in history) {
  // scrolls to top of pages on navigation
  history.scrollRestoration = 'manual'
}

function renderApp() {
  const root = document.getElementById('react-app-saved-lists')
  render(
    <Locale value={{ currencyCode: 'USD', locale }}>
      <SessionContextProvider>
        <Routes />
      </SessionContextProvider>
    </Locale>,
    root
  )
}

if (module.hot) {
  module.hot.accept('./routes', renderApp)
}
