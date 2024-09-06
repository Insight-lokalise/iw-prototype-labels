import React from 'react'
import { render } from 'react-dom'
import { Locale } from '@insight/toolkit-react'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { getCurrentLocale } from '@insight/toolkit-utils'
import { i18n } from '@insight/toolkit-utils/lib/labels'
import Routes from './routes'
import './scss/index.scss'
import { QuotesContextProvider } from './context/QuotesContext'
import {getAccountInformation} from "./api";

const locale = getCurrentLocale('insight_current_locale')

i18n({ app: 'app-quotes', locale }).then((labels) => {
  setToolkitLabels(labels)
  renderApp(Routes)
})

if ('scrollRestoration' in history) {
  // scrolls to top of pages on navigation
  history.scrollRestoration = 'manual'
}

function renderApp() {
  getAccountInformation().then(
    ({ isCES, webGroupId}) => {
      const root = document.getElementById('react-app-quotes')
      render(
        <Locale value={{currencyCode: 'USD', locale}}>
          <QuotesContextProvider>
            <Routes isCES={isCES} webGroupId={webGroupId} />
          </QuotesContextProvider>
        </Locale>,
        root
      )
    })
}

if (module.hot) {
  module.hot.accept('./routes', renderApp)
}
