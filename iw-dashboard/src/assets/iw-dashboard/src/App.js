/**
 * This is the beginning of the meat of your app. It can be helpful to coordinate
 * things such as translation and routing here.
 */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Locale } from "@insight/toolkit-react"
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'

import { IWLoading } from './iw-components'
import { store } from './config/storeConfig'
import Dashboard from './Dashboard/containers/Dashboard'
import reduxInit from './config/reduxInit'
import { getTranslations } from "./services"

reduxInit()

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    getTranslations()
      .then(() => this.setState({ isLoading: false }))
      .catch(() => this.setState({ isLoading: false }))
  }

  render() {

    const {props, state} = this;
    return state.isLoading ? (
      <IWLoading />
    ) : (
      <Provider store={store}>
        <Locale value={{ locale: props.locale || getCurrentLocale("insight_current_locale", "insight_locale") }}>
          <Dashboard />
        </Locale>
      </Provider>
    )
  }
}
