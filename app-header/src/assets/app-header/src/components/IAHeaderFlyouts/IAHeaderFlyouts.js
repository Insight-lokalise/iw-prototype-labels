import React, { Fragment, useContext, useEffect, useState } from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'

import { getFixedToolsMenuItems, TOOLS_MENU_TITLES, t } from 'api'

import AccountTools from './AccountTools'
import AccountToolsSimple from './AccountToolsSimple'
import ChatNow from '../IAHeaderTop/ChatNow'
import CreateAccount from '../IAHeaderTop/CreateAccount'
import FavoriteLinks from './FavoriteLinks'
import IAHeaderContext from '../../context/IAHeaderContext'
import IAHeaderMegaMenu from '../IAHeaderMegaMenu/IAHeaderMegaMenu'
import Locale from './Locale'
import LoggedInBar from '../LoggedInBar/LoggedInBar'
import Login from '../IAHeaderTop/Login'
import Logout from '../IAHeaderTop/Logout'
import Notifications from '../IAHeaderTop/Notifications'
import PhoneNumber from '../IAHeaderTop/PhoneNumber'
import SubmenuItems from '../IAHeaderMegaMenu/SubmenuItems'
import LocaleMenu from '../HeaderSimple/Navigation/LocaleMenu'
import useFilteredItemMap from '../../hooks/useFilteredItemMap'
import useHideCreateAccount from '../../hooks/useHideCreateAccount'

export default function IAHeaderFlyouts({ isCES }) {
  const {
    headerInfo: { isLoggedIn },
    menuItems: { mainNav, support, tools },
  } = useContext(IAHeaderContext)

  const [fixedToolsItems, setFixedToolsItems] = useState([])

  useEffect(() => {
    getFixedToolsMenuItems().then((fixedToolsMenuItems) => {
      setFixedToolsItems(fixedToolsMenuItems)
    })
  }, [])

  const filteredItemMap = useFilteredItemMap()

  const supportItems = support.nodes
  const toolsItems = tools.nodes

  const renderNavItem = (navItem, i) => {
    if (navItem?.type === 'link' && !navItem?.nodes) {
      // if the type of item is link and has no nodes attached to it , it will behave as link and not dropdown
      return <Header.Flyout.Item title={navItem?.title} href={navItem?.href} target={navItem?.targetBlank ? '_blank' : '_self'} />
    }
    else {
      const id = `headerMobileMega${i + 1}`
      return (
        <Header.Flyout.MegaMenu key={id} id={id} title={navItem.title}>
          <IAHeaderMegaMenu isMobile {...navItem} isCES={isCES} />
        </Header.Flyout.MegaMenu>
      )
    }
  }
  return (
    <Fragment>
      <Header.Flyout id="flyout1">
        {mainNav.map((item, index) => {
          return filteredItemMap[item.id] ? null : renderNavItem(item, index)
        })}
        {!isCES && (
          <>
            {toolsItems.length > 0 && (
              <Header.Flyout.MegaMenu
                id="headerMobileTools"
                title={tools.title}
              >
                <ul className="o-list-bare  c-header-nav__list">
                  <SubmenuItems isMobile items={toolsItems} />
                </ul>
              </Header.Flyout.MegaMenu>
            )}
            {supportItems.length > 0 && (
              <Header.Flyout.MegaMenu
                id="headerMobileSupport"
                title={support.title}
              >
                <ul className="o-list-bare  c-header-nav__list">
                  <SubmenuItems isMobile items={supportItems} />
                </ul>
              </Header.Flyout.MegaMenu>
            )}
            <Locale />
            <PhoneNumber wrapper={Header.Flyout.Item} />
            <Notifications isMobile wrapper={Header.Flyout.Item} />
            <ChatNow isMobile type="nav" />
            <Login wrapper={Header.Flyout.Item} />
            <Logout wrapper={Header.Flyout.Item} />
            {!useHideCreateAccount() && (
              <CreateAccount wrapper={Header.Flyout.Item} />
            )}
          </>
        )}
      </Header.Flyout>
      <Header.Flyout id="flyout2">
        <LoggedInBar isMobile isCES={isCES} />
        {!isCES && (
          <>
            {isLoggedIn && <AccountTools />}
            {fixedToolsItems.map(({ title, favoriteLinks, ...rest }) => {
              switch (title) {
                case TOOLS_MENU_TITLES.FAVORITES:
                  return (
                    <FavoriteLinks key={title} favoriteLinks={favoriteLinks} />
                  )
                default:
                  return (
                    <Header.Flyout.Item key={title} {...rest}>
                      {t(title)}
                    </Header.Flyout.Item>
                  )
              }
            })}
            <Notifications isMobile wrapper={Header.Flyout.Item} />
          </>
        )}
        {isCES && <AccountToolsSimple />}
        {isCES ? <Logout withIcon /> : <Logout wrapper={Header.Flyout.Item} />}
      </Header.Flyout>
      {isLoggedIn ? (
        <Header.Flyout id="LocaleSelector">
          <LocaleMenu showSelected />
        </Header.Flyout>
      ) : null}
    </Fragment>
  )
}
