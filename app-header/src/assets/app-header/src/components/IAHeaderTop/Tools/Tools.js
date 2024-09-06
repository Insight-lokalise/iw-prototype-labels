import React, { useContext } from 'react'

import Dropdown from '../Dropdown'
import IAHeaderContext from '../../../context/IAHeaderContext'
import { MASTHEAD_ICON_TITLES_TOOLS } from '../../../api/common/constants'
import { t } from 'api'

export default function Tools() {
  const {
    menuItems: { tools },
  } = useContext(IAHeaderContext)

  const toolsMenuItems = tools.nodes
  const title = MASTHEAD_ICON_TITLES_TOOLS

  return toolsMenuItems.length ? <Dropdown id="headerToolsDropdown" text={tools.title} items={toolsMenuItems} title={t(title)}/> : null
}

Tools.propTypes = {}
