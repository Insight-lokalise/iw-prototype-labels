import React, { useContext } from 'react'

import Dropdown from './Dropdown'
import IAHeaderContext from '../../context/IAHeaderContext'
import { MASTHEAD_ICON_TITLES_SUPPORT } from '../../api/common/constants'
import { t } from 'api'

export default function Support() {
  const {
    menuItems: { support },
  } = useContext(IAHeaderContext)

  const supportMenuItems = support.nodes
  const title = MASTHEAD_ICON_TITLES_SUPPORT

  return supportMenuItems.length ? (
    <Dropdown id="headerSupportDropdown" text={support.title} items={supportMenuItems} title={t(title)} />
  ) : null
}

Support.propTypes = {}
