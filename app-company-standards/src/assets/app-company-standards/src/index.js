import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import { Locale } from '@insight/toolkit-react'
import { getInObject, detectPointer } from '@insight/toolkit-utils'

import createStore from './state/createStore'
import { getInitialData } from './duck'
import CompanyStandardsContainer from './containers/CompanyStandardsContainer'
import './scss/index.scss'
import { getCookie, getWebGroupId } from './lib'

const isManagerView = !!document.getElementById('react-app-company-standards').getAttribute('data-manager')
const wId = getWebGroupId(isManagerView)

const store = createStore()
store.dispatch(getInitialData({ wId, isManagerView }))
const locale = getCookie('insight_locale')
// this need to updated to read from API
const currencyCode = getInObject(window, ['Insight', 'userInformation', 'currencyCode'], 'USD')

function renderApp() {
  const root = document.getElementById('react-app-company-standards')
  const darklyFlag = window.flags && window.flags['GNA-9381-MANAGER-VIEW']
  const allowAccess = !isManagerView || darklyFlag
  render(allowAccess ?
    (
      <Provider store={store}>
        <Locale value={{ currencyCode, locale }}>
          <CompanyStandardsContainer isManagerView={isManagerView} webGroupId={wId} />
        </Locale>
      </Provider>
    ) : (
      <div className="ds-v1">
        <div className="c-panel" style={{ margin: '6px 12px 0px 14px' }}>
          <div className="o-grid" style={{ padding: '12px 0px 0px 14px' }}>
            <div className="o-grid__item u-1/1 u-margin-bot-small">
              <h1 className="u-h2 u-text-bold u-margin-bot-none" style={{ color: '#3e332d' }}>Manage Standards</h1>
            </div>
            <div className="o-grid__item u-1/1 u-margin-bot">
              <p style={{ color: '#3e332d' }}>This page is currently not available. Please contact your support team for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    root
  )
}

renderApp()
detectPointer()

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }
if (module.hot) {
  module.hot.accept('./routes', renderApp)
}
