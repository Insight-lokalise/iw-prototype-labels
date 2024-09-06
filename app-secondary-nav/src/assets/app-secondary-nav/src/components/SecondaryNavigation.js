import React from 'react'
import PropTypes from 'prop-types'

import Header from './Header'
import MenuItems from './MenuItems'

export default function SecondaryNavigation({ navInfo }) {
  const {
    headerBackgroundColor,
    headerText,
    mobileHeaderTitle,
    menuItemsList,
    headerLinkPath,
  } = navInfo

  return (
    <div className="ds-v1">
      <div className="c-secondary-navigation">
        <Header theme={headerBackgroundColor} title={headerText} mobileTitle={mobileHeaderTitle} link={headerLinkPath}>
          <MenuItems menuItems={menuItemsList} />
        </Header>
      </div>
    </div>
  )
}

SecondaryNavigation.propTypes = {
  navInfo: PropTypes.shape({
    headerText: PropTypes.string.isRequired,
    headerBackgroundColor: PropTypes.string.isRequired,
    headerLinkPath: PropTypes.string.isRequired,
    menuItemsList: PropTypes.arrayOf(PropTypes.shape({
      gtmEvent: PropTypes.string,
      linkPath: PropTypes.string.isRequired,
      linkText: PropTypes.string.isRequired,
      menuList: PropTypes.arrayOf(PropTypes.shape({
        gtmEvent: PropTypes.string,
        linkPath: PropTypes.string.isRequired,
        linkText: PropTypes.string.isRequired,
        menuList: PropTypes.arrayOf(PropTypes.shape({
          gtmEvent: PropTypes.string,
          linkPath: PropTypes.string.isRequired,
          linkText: PropTypes.string.isRequired,
        }))
      }))
    }))
  }).isRequired,
}
