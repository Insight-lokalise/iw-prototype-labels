import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import WhatWeDo from './WhatWeDo'
import ClientStories from './ClientStories'
import ContentResources from './ContentResources'
import ConnectWithUs from './ConnectWithUs'
import Shop from './Shop'
import ShopSimple from './ShopSimple'
import IAHeaderContext from '../../context/IAHeaderContext'
/* Fly-out mega menu and mobile menu */
export default function IAHeaderMegaMenu({ isMobile, name, nodes, isCES }) {
  const {
    headerInfo: { locale, isIPSUser, isLoggedIn, isSEWPUser },
  } = useContext(IAHeaderContext)

  const localeArr = locale.split('_')
  let showLoggedOutMenu = false

  if (
    (localeArr[1] === 'CA' || localeArr[1] === 'US') &&
    !isIPSUser &&
    !isSEWPUser &&
    window.flags &&
    window.flags['GNA-12386-DEFAULT-LOGGED-OUT']
  ) {
    showLoggedOutMenu = true
  }

  const COMPONENTS = {
    'what-we-do': WhatWeDo,
    'client-stories': ClientStories,
    'content-and-resources': ContentResources,
    'connect-with-us': ConnectWithUs,
    shop: isCES || showLoggedOutMenu ? ShopSimple : Shop,
    shopSimple: ShopSimple,
  }

  const Component = COMPONENTS[name]

  if (!Component) {
    console.error(
      `'${name}' is not a valid name for a mega menu. Permitted values are: ${Object.keys(
        COMPONENTS
      ).join(', ')}`
    )
  }

  return Component ? (
    <Component
      isMobile={isMobile}
      submenuList={nodes}
      showLoggedOutMenu={showLoggedOutMenu}
      isCES={isCES}
      isLoggedIn={isLoggedIn}
    />
  ) : null
}

IAHeaderMegaMenu.propTypes = {
  isMobile: PropTypes.bool,
  name: PropTypes.string.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isCES: PropTypes.bool,
}

IAHeaderMegaMenu.defaultProps = {
  isMobile: false,
  isCES: false,
}
