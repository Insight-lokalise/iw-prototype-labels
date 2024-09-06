import React, { Fragment, useContext } from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'
import Flag from '@insight/toolkit-react/lib/Flag/Flag'

import { COUNTRIES } from 'api'

import IAHeaderContext from '../../context/IAHeaderContext'
import LocaleSelector from '../IAHeaderTop/Locale/LocaleSelector'
import LinkedSites from '../IAHeaderTop/Locale/LinkedSites'
import usePermissions from '../../hooks/usePermissions'

export default function Locale() {
  const {
    headerInfo: { isLoggedIn, locale },
  } = useContext(IAHeaderContext)
  const { enableCountrySelect = true } = usePermissions()

  const isEnabled = !isLoggedIn || enableCountrySelect
  const country = locale.toLowerCase().split('_')[1]
  const title = (
    <Fragment>
      <Flag country={country} />
      {` ${COUNTRIES[country].label}`}
    </Fragment>
  )

  return isEnabled ? (
    <Header.Flyout.MegaMenu id="headerMobileLocaleSelector" title={title}>
      <div className="o-box">
        <LocaleSelector />
        <LinkedSites />
      </div>
    </Header.Flyout.MegaMenu>
  ) : (
    <Header.Flyout.Item>{title}</Header.Flyout.Item>
  )
}

Locale.propTypes = {}
