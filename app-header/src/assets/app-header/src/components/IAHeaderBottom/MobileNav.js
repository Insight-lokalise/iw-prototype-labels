import React from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'

import Cart from '../IAHeaderTop/Cart'
import AccountMenuButton from './AccountMenuButton'

export default function MobileNav({ showOnlyCart = false }) {
  return (
    <Header.Nav.Mobile>
      {!showOnlyCart ? <AccountMenuButton />:null}
      <Cart isMobile />
      {!showOnlyCart ? <Header.Nav.Mobile.Search />:null}
      <Header.Nav.Mobile.Hamburger activates="flyout1" />
    </Header.Nav.Mobile>
  )
}

MobileNav.propTypes = {}
