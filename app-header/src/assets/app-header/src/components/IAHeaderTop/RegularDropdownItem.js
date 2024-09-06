import React from 'react'
import PropTypes from 'prop-types'

import { TOOLS_MENU_TITLES } from 'api'
import CloudManagementLink from './Tools/CloudManagementLink'
import MenuDivider from './MenuDivider'
import FavoriteLinks from './Tools/FavoriteLinks'
import DropdownItem from './DropdownItem'

export default function RegularDropdownItem({ title, favoriteLinks, ...rest }) {
  switch (title) {
    case TOOLS_MENU_TITLES.CLOUD_MANAGEMENT:
      return <CloudManagementLink key={title} {...rest} />
    case TOOLS_MENU_TITLES.DIVIDER:
      return <MenuDivider key={title} />
    case TOOLS_MENU_TITLES.FAVORITES:
      return <FavoriteLinks key={title} favoriteLinks={favoriteLinks} />
    default:
      return <DropdownItem key={title} title={title} {...rest} />
  }
}

RegularDropdownItem.propTypes = {
  title: PropTypes.string.isRequired,
  favoriteLinks: PropTypes.arrayOf(PropTypes.shape({})),
}

RegularDropdownItem.defaultProps = {
  favoriteLinks: [],
}
