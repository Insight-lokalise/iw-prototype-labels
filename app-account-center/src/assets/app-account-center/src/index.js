import React from 'react'
import { render } from 'react-dom'
import { Locale } from '@insight/toolkit-react'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import { i18n, t } from '@insight/toolkit-utils/lib/labels'

import Routes from './routes'
import './scss/index.scss'
import { getAccountInformation, getFeatureFlags } from './api'

const locale = getCurrentLocale('insight_current_locale')

i18n({ app: 'app-account-center', locale }).then((labels) => {
  setToolkitLabels(labels)
  renderApp(Routes)
})

function renderApp() {
  const root = document.getElementById('react-app-account-center')
  document.title = t('Account settings')

  Promise.all([getAccountInformation(), getFeatureFlags()]).then(
    ([accountInfo, featureFlags]) => {
      const {
        displayDashboard,
        isLoginAs,
        isRequestor,
        currencyCode,
        salesOrg,
        enableCyberSource,
        pingDomain,
        pingClientId,
      } = accountInfo
      render(
        <Locale
          value={{
            displayDashboard,
            locale,
            isLoginAs,
            isRequestor,
            currencyCode,
            salesOrg,
            enableCyberSource,
            pingDomain,
            pingClientId,
          }}
        >
          <Routes />
        </Locale>,
        root
      )
    }
  )
}

if (module.hot) {
  module.hot.accept('./routes', renderApp)
}
