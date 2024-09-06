import React, { useContext } from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'

import HeaderContext from '@insight/toolkit-react/lib/Header/HeaderContext'

export default function MenuLink() {
  const { activeFlyout, toggleFlyout, closeMegaMenu, isSearchActive, setActiveFlyout } = useContext(HeaderContext)
  const menuFlyOutId = 'flyout1'
  const showCloseIcon = activeFlyout == menuFlyOutId || isSearchActive

  function handleClick() {
    //cancel action
    if(showCloseIcon) {
      if (isSearchActive) {
        //when search suggestions is active, this becomes close button for suggestions menu
        setActiveFlyout(null)
      }
      else {
        //close current active flyout menu
        toggleFlyout(activeFlyout)
      }
    }
    //menu action
    else {
      toggleFlyout(menuFlyOutId)
    }
    if (activeFlyout) {
      closeMegaMenu()
    }
  }

  return (
    <li className='o-list-inline__item  c-header-simple-nav__item'>
      <Button
        onClick={handleClick}
      >
        <Icon icon={(showCloseIcon) ? 'close' : 'navicon'} />
      </Button>
    </li>
  )
}
