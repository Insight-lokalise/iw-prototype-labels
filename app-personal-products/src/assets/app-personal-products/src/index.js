import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Locale } from '@insight/toolkit-react'

import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { PersonalProducts } from './containers'
import createStore from './state/createStore'
import { getUserData } from './duck'
import { getTranslations } from './api/us'

import './scss/index.scss'

const store = createStore()
const localeValue = getCurrentLocale("insight_current_locale", "insight_locale")
const { dispatch } = store
Promise.resolve(getTranslations(localeValue)).then(() => {
  dispatch(getUserData(window.Insight))
  ReactDOM.render(
    <Provider store={store}>
      <Locale value={{locale: localeValue}}>
        <PersonalProducts />
      </Locale>
    </Provider>,
    document.getElementById('react-app-personal-products')
  )
})




