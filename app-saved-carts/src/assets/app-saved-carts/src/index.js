import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Locale } from '@insight/toolkit-react'
import { getInObject, getCurrentLocale } from '@insight/toolkit-utils'

import SavedCarts from './containers/SavedCarts'
import createStore from './state/createStore'
import './scss/index.scss'
import { setupStore } from './duck'
import { INSIGHT_LOCALE_COOKIE_NAME } from './lib'

const element = document.getElementById('react-app-saved-carts')
const locale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
const currencyCode = getInObject(window, [ 'Insight', 'userInformation', 'currencyCode' ], 'USD')
const store = createStore()
// Pre-load data
store.dispatch(setupStore())

ReactDOM.render(
  <Provider store={store}>
    <Locale value={{ currencyCode, locale }}>
      <SavedCarts />
      { /*
         * Hack to include missing icons needed for this project.
         * At the moment the only icons available are those that existed at the time the header project was released.
         * TODO: Refactor the way icons are included on the page, so that they're provided by the toolkit, not by a particular project.
         */ }
      <svg xmlns="https://www.w3.org/2000/svg" display="none">
        <symbol id="close-circled" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48C140.559 48 48 140.559 48 256c0 115.436 92.559 208 208 208 115.435 0 208-92.564 208-208 0-115.441-92.564-208-208-208zm104.002 282.881l-29.12 29.117L256 285.117l-74.881 74.881-29.121-29.117L226.881 256l-74.883-74.881 29.121-29.116L256 226.881l74.881-74.878 29.12 29.116L285.119 256l74.883 74.881z"></path></symbol>
        <symbol id="load-c" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M479.8 226.1c-1.4-8.7-3.1-17.3-5.3-25.8-2.8-10.8-6.4-21.5-10.8-31.8-8.9-21.2-21.1-41-35.9-58.6-16-18.9-35.3-35.2-56.7-47.7C350 49.8 327 41 303 36.1c-12.4-2.5-24.9-4-37.6-4.1-9.9-.1-19.8.3-29.6 1.2-25.5 2.5-50.7 9.6-73.9 20.5-19.9 9.4-38.4 21.6-54.8 36.2-16.4 14.6-30.7 31.6-42.2 50.3-12.7 20.8-22.2 43.5-27.4 67.3-4.2 19-6.2 38.6-5.2 58.1.9 18.9 3.8 37.8 9.5 55.9 3.6 11.5 7.9 22.7 13.3 33.6 5.3 10.7 11.5 21 18.4 30.7 13.8 19.3 30.6 36.4 49.8 50.5 19.6 14.5 41.7 25.7 64.9 33.1 24.2 7.7 49.9 11.3 75.3 10.4 24.8-.8 49.4-5.6 72.6-14.5 22.3-8.6 43.2-20.9 61.5-36.3 9.2-7.8 17.4-16.6 25.1-25.9 7.8-9.4 14.8-19.3 20.6-30 5-9.2 9.2-18.8 12.8-28.5 1.8-4.8 3.5-9.6 4.9-14.6 1.5-5.3 2.6-10.8 3.6-16.2 1.5-8.5 2.1-17.3 1.3-25.9-.7 3.8-1.3 7.5-2.2 11.2-1.1 4.3-2.5 8.5-4.1 12.6-3.2 8.7-7.2 17.1-11 25.5-4.9 10.7-10.6 20.9-16.8 30.8-3.2 5.1-6.5 10.1-10.1 14.9-3.6 4.8-7.7 9.4-11.8 13.9-8.2 9.1-17.1 17.2-27 24.4-10.1 7.4-20.8 13.9-32.1 19.3-22.6 11-47.3 17.6-72.3 19.8-25.6 2.2-51.7-.3-76.3-7.6-23.4-6.9-45.6-18.1-65.1-32.8-18.9-14.3-35.3-31.9-48.2-51.8C75.4 347.8 66.1 324.9 61 301c-1.3-6.2-2.3-12.6-3-18.9-.6-5.4-1.1-10.9-1.3-16.4-.3-11.3.4-23 2.1-34.2 3.7-24.6 11.7-48.3 24.1-69.9 11-19.3 25.3-36.7 42.1-51.4 16.8-14.8 36-26.7 56.8-35.1 12-4.9 24.6-8.5 37.4-10.9 6.5-1.2 13-2.2 19.5-2.7 3.2-.3 6.3-.3 9.5-.6 1.3 0 2.6.1 3.9.1 21.7-.4 43.5 2.4 64.2 8.9 22.3 7 43.3 18.3 61.5 33 19.1 15.4 35 34.4 47 55.8 10.2 18.2 17.5 37.8 21.9 58.2 1 4.7 1.8 9.4 2.6 14.1.7 4.3 3.1 8.3 6.8 10.7 7.8 5.2 18.7 1.7 22.5-6.7 1.3-2.9 1.7-6 1.2-8.9z" />
        </symbol>
      </svg>

    </Locale>
  </Provider>
  , element
)
