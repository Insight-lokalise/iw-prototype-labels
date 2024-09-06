import React, { useContext } from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'
import Flag from '@insight/toolkit-react/lib/Flag/Flag'

import { t } from 'api'
import IAHeaderContext from '../../../context/IAHeaderContext'
import LocaleSelector from './LocaleSelector'
import LinkedSites from './LinkedSites'
import { MASTHEAD_ICON_TITLES_LOCALE } from '../../../api/common/constants'

export default function Locale() {
  const {
    headerInfo: { isLoggedIn, locale, userInformation = {} },
  } = useContext(IAHeaderContext)

  const { permissions = {} } = userInformation
  const { enableCountrySelect = true } = permissions
  const title = MASTHEAD_ICON_TITLES_LOCALE

  const isEnabled = !isLoggedIn || enableCountrySelect

  const defaultCountry = locale.toLowerCase().split('_')[1]

  return isEnabled ? (
    <Header.Top.Dropdown
      closeOnDropdownClick={false}
      id="headerLocaleDropdown"
      text={<Flag country={defaultCountry} />}
      ariaLabel={t("Country and language configuration")}
      title={t(title)}
    >
      <li className="c-header-dropdown__item  c-header-locale">
        <div className="c-header-dropdown__inner">
          <LocaleSelector />
          <LinkedSites />
        </div>
      </li>
    </Header.Top.Dropdown>
  ) : (
    <li className="o-list-inline__item  c-header-top__item">
      <Flag country={defaultCountry} />
    </li>
  );
}

Locale.propTypes = {}
