/**
 *  This is the entry point of the app. Top level configuration and
 *  setup belongs here, such as additional polyfills or global styles.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import 'iw-styles'
import '@insight/toolkit-css-core'
import '@insight/toolkit-css-ui'

import './config/polyfills'

// Import shared global styles from the iw-styles project

import App from './App'

ReactDOM.render(<App />, document.getElementById('react-dashboard-app'))
