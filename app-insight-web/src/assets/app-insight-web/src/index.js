import React from 'react'
import { render } from 'react-dom'

import { getTranslations }  from 'api'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import Routes from './routes'
import './scss/index.scss'

function renderApp() {
  const locale = getCurrentLocale("insight_current_locale", "insight_locale")
  const root = document.getElementById('react-insight-web-app')
  Promise.resolve(getTranslations(locale)).then(() => {
    render(
      <Routes />,
      root
    )
  })

}

renderApp(Routes)

if (module.hot) {
	module.hot.accept('./routes', renderApp)
}
