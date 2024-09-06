import React from 'react'
import { render } from 'react-dom'
import { Locale } from '@insight/toolkit-react'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import { i18n } from '@insight/toolkit-utils/lib/labels'
import Routes from './routes'
import './scss/index.scss'
import { InvoiceContextProvider } from './context/InvoiceContext'

const locale = getCurrentLocale('insight_current_locale')

i18n({ app: 'app-invoices', locale }).then((labels) => {
  setToolkitLabels(labels)
  renderApp(Routes)
})

function renderApp() {
  const root = document.getElementById('react-app-invoices')

  if ('scrollRestoration' in history) {
    // scrolls to top of pages on navigation
    history.scrollRestoration = 'manual'
  }

  render(
    <Locale value={{ currencyCode: 'USD', locale }}>
      <InvoiceContextProvider>
        <Routes />
      </InvoiceContextProvider>
    </Locale>,
    root
  )
}

if (module.hot) {
  module.hot.accept('./routes', renderApp)
}
