import React, { useContext } from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'

import { getClientAdminURL } from 'api'
import { t } from 'api'
import IAHeaderContext from '../../context/IAHeaderContext'

export default function ClientAdmin() {
  const {
    headerInfo: { isLoggedIn, userInformation },
  } = useContext(IAHeaderContext)

  const showLink = isLoggedIn && userInformation.isInternalUser

  return (
    showLink && (
      <Header.Top.Item href={getClientAdminURL(userInformation.clientAdminUrl)}>
        {t('Return to Client Admin')}
      </Header.Top.Item>
    )
  )
}

ClientAdmin.propTypes = {}
