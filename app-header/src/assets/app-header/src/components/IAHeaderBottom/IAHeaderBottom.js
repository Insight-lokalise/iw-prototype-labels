import React, { useContext } from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'

import PropTypes from "prop-types";
import IAHeaderContext from "../../context/IAHeaderContext";
import DesktopNav from './DesktopNav'
import InsightLogo from './Logo/InsightLogo'
import ITSLogo from './Logo/ITSLogo'
import MobileNav from './MobileNav'
import Search from './Search'
import Cart from '../IAHeaderTop/Cart'

/* The bottom part of the header (logo, main nav, and search) */
export default function IAHeaderBottom({
  isDesktop,
  showOnlyCartLink = false,
}) {
  const {
    headerInfo: {
      userInformation: { b2bInfo },
      locale,
      isLoggedIn,
      isIPSUser,
      isSEWPUser
    },
    isHybridExperience
  } = useContext(IAHeaderContext)
  const isITS = !!b2bInfo && b2bInfo.isITS
  var isDefaultLoggedOutExperience = window.flags && window.flags['GNA-12386-DEFAULT-LOGGED-OUT'] && !isIPSUser && !isSEWPUser;
  const isLoggedOutIPS = window.flags && window.flags['GNA-12345-LOGGEDOUT-E4-IPS']
  const isGuestSearchEnabled = isDefaultLoggedOutExperience || isHybridExperience || isLoggedOutIPS;
  const showCartLink = isDesktop && showOnlyCartLink;
  return (
    <Header.Bottom>
      {isITS ? <ITSLogo /> : <InsightLogo />}
      <Header.Nav>
        {(isDesktop && !showOnlyCartLink) ? <DesktopNav /> : <MobileNav showOnlyCart={showOnlyCartLink} />}
      </Header.Nav>
      {!showOnlyCartLink ? (
        <Search
          isDesktop={isDesktop}
          isGuestSearchEnabled={isGuestSearchEnabled}
        />
      ) : null}
      {showCartLink ? <Cart /> : null}
    </Header.Bottom>
  )
}

IAHeaderBottom.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
}
