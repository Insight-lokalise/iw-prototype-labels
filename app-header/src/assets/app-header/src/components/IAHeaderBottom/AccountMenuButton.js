import React, { useContext } from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'

import { getLoginURL, t } from 'api'
import IAHeaderContext from '../../context/IAHeaderContext'

export default function AccountMenuButton() {
  const { headerInfo: { isLoggedIn } } = useContext(IAHeaderContext)
  const label = t('Account')
  const action = isLoggedIn ? { activates: 'flyout2' } : { href: getLoginURL() }

  return (
    <Header.Nav.Mobile.Item icon="person" {...action}>
      {label}
    </Header.Nav.Mobile.Item>
  )
}
