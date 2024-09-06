import React from 'react'
import { render } from 'react-dom'
import { getTranslations } from 'api'
import { Locale } from '@insight/toolkit-react'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import SoftwareLicensingView from './components/views/SoftwareLicensingView'
import './scss/index.scss'

const localeValue = getCurrentLocale('insight_current_locale','insight_locale')

Promise.resolve(getTranslations(localeValue)).then(() => {
  render(
    <Locale value={{ locale: localeValue }}>
      <SoftwareLicensingView />
    </Locale>,
    document.getElementById('react-app-software-licensing')
 )
})
