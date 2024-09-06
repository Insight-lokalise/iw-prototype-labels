import React, { useContext } from 'react'
import { t } from 'api'

import IAHeaderContext from '../../context/IAHeaderContext'
import DropdownButton from './DropdownButton'

export default function UserInfo() {
  const {
    headerInfo: {
      userInformation: { email, firstName, lastName, username },
    },
  } = useContext(IAHeaderContext)

  const userFullName = `${firstName} ${lastName}`.trim()
  const userDisplayName = userFullName || username || email || ''
  const userDisplayValue = `${t('User')} - ${userDisplayName}`

  return <DropdownButton icon="contact">{userDisplayValue}</DropdownButton>
}

UserInfo.propTypes = {}
