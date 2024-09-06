import React from 'react'
import { render } from 'react-dom'

import { getLocaleFromCookie, getTranslations } from 'api'

import CreateAccount from './components/CreateAccount'
import './scss/index.scss'

function renderApp() {
  const element = document.getElementById('react-app-create-account')
  const title = element.dataset.title
  const description = element.dataset.description
  const locale = getLocaleFromCookie()

  Promise.resolve(getTranslations(locale)).then(() => {
    render(
      <CreateAccount {...{title, description, locale}}/>,
      element
    )
  })

}

renderApp()

