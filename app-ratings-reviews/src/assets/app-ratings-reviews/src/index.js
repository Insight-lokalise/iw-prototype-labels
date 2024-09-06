import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Locale } from '@insight/toolkit-react/lib/Locale/Locale'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'

import RatingsAndReviews from './containers/RatingsAndReviews'
import createStore from './state/createStore'
import { getUserData } from './duck'
import './scss/index.scss'


const element = document.getElementById('react-app-ratings-reviews')
const itemInfo = {
  description: element.getAttribute('description'),
  fingerPrint: element.getAttribute('fingerPrint'),
  imageURL: element.getAttribute('imageURL'),
  materialId: element.getAttribute('materialId'),
}
const localeValue = getCurrentLocale("insight_current_locale", "insight_locale")
const store = createStore()
const { dispatch } = store
dispatch(getUserData(window.Insight, localeValue))

ReactDOM.render(
  <Provider store={store}>
    <Locale value={{localeValue}}>
      <RatingsAndReviews itemInfo={itemInfo} locale={localeValue} />
    </Locale>
  </Provider>
  , element
)
