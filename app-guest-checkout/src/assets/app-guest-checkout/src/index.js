import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { Locale } from '@insight/toolkit-react/lib/Locale/Locale'
import { PersistGate } from 'redux-persist/integration/react'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import { persistStore } from 'redux-persist'
import { Loading } from '@insight/toolkit-react'
import { i18n } from '@insight/toolkit-utils/lib/labels'

import createStore from './state/createStore'
import Routes from './routes'
import './scss/index.scss'
import { getAccountInformation } from './api/getData'

const store = createStore()
export const persistor = persistStore(store)

const locale = getCurrentLocale('insight_current_locale')

i18n({ app: 'app-guest-checkout', locale }).then((labels) => {
  setToolkitLabels(labels)
  renderApp(Routes)
})

function renderApp() {
  const root = document.getElementById('react-app-guest-checkout')
  getAccountInformation().then(
    ({
      isLoggedIn,
      sessionId,
      locale,
      account,
      webGroupId,
      salesOrg,
      soldto,
      webLoginProfileId,
      ipsUser,
      isCES,
      currencyCode,
      isIntegration,
      reportingParentId,
      permissions,
    }) => {
      render(
        <Locale
          value={{
            isLoggedIn,
            sessionId,
            locale,
            account,
            webGroupId,
            salesOrg,
            soldto,
            webLoginProfileId,
            ipsUser,
            isCES,
            currencyCode,
            isIntegration,
            reportingParentId,
            permissions,
          }}
        >
          <Provider store={store}>
            <PersistGate
              loading={<Loading size={'large'} />}
              persistor={persistor}
            >
              <Routes />
            </PersistGate>
          </Provider>
        </Locale>,
        root
      )
    }
  )
}

renderApp()

if (module.hot) {
  module.hot.accept('./routes', renderApp)
}
