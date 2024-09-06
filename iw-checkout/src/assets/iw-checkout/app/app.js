/**
 *  This is the entry point of our app. High level configuration and
 *  setup belongs go here. For example, configuration of a data management
 *  tool or a router.
 */
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import { Locale } from '@insight/toolkit-react/lib/Locale/Locale'
import { getInObject } from '@insight/toolkit-utils'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import './libs/polyfillIncludes'

// This import tells webpack to include the SCSS files in its compilation.
import './app.scss'

import { store } from './libs/storeConfig'

/**
 *  There may be many actions we want to initiate only once and as soon as the
 *  application loads.
 *  e.g.: The ShowIf component is (will be?) used widely and requires some pieces of
 *  information to be stored in the state. We would normally do this by intializing
 *  the required state via componentWillMount. However, the ShowIf component may be
 *  initialized dozens of separate times and this would both slow performance and
 *  pollute the list of actions with many redundant ones.
 */
import { reduxInit } from './libs/reduxInit'
import { IWTranslationProvider } from './../libs/iw-components'
import { Routes } from './libs/routerConfig'
import { getAllFeatureFlags } from 'app-api-user-service'

const localeValue = getCurrentLocale("insight_current_locale", "insight_locale")
const isLoggedIn = getInObject(window, [ 'Insight', 'isLoggedin' ], false)
const userInfo = getInObject(window, [ 'Insight', 'userInformation' ], {})
const isCES = isLoggedIn ? userInfo.isCES : false

// external logic to handle shopping request in UI state , as user jumps to iw-checkout means local storage shopping
// request is transformed to backend shopping request
// remove shopping request from storage
const cartInSession = window.localStorage.getItem("cartInSession")
if(cartInSession) {
    window.localStorage.removeItem("persist:checkout")
}

getAllFeatureFlags().then(() => {
  reduxInit();

  ReactDOM.render(
    <Provider store={store}>
      <Locale value={{ locale: localeValue, isCES, isLoggedIn }}>
        <IWTranslationProvider>
          <Routes isCES={isCES} />
        </IWTranslationProvider>
      </Locale>
    </Provider>,
    document.getElementById('CartContainer')
  )
})
