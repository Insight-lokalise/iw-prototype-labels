import React, { useContext, useEffect, useState } from 'react'
import { Button, Dropdown, Flag, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import IAHeaderContext from '../../../context/IAHeaderContext'
import HeaderContext from '@insight/toolkit-react/lib/Header/HeaderContext'
import { LocaleMenu } from './LocaleMenu'
import { getWebGroups } from 'api'
import useDefaultOverlay from "../../../hooks/useDefaultOverlay";

const MENU_FLYOUT_ID = 'LocaleSelector'

export const LocaleLink = ({ isDesktop }) => {
  const { activeFlyout, toggleFlyout, closeMegaMenu } =
    useContext(HeaderContext)
  const { headerInfo } = useContext(IAHeaderContext)
  const { isLoggedIn, locale } = headerInfo
  // Determine if we should show an interactive locale control
  const [showStaticLocale, setStaticLocale] = useState(true)
  // Get the users default country
  const defaultCountry = locale.toLowerCase().split('_')[1]
  // Check if the active flyout menu is the locale selector menu
  const showCloseIcon = activeFlyout == MENU_FLYOUT_ID

  const fetchWebGroups = async () => {
    try {
      const { results } = await getWebGroups()
      // Filter results removing 'unitedstates' from list of webgroups
      const webgroups = results.filter(
        ({ csscountryflag }) => csscountryflag !== 'unitedstates'
      )
      if (!webgroups?.length) return
      setStaticLocale(false)
    } catch (err) {}
  }

  useEffect(() => {
    if (isLoggedIn) fetchWebGroups()
  }, [isLoggedIn])

  const handleClick = () => {
    toggleFlyout(MENU_FLYOUT_ID)
    if (activeFlyout) closeMegaMenu()
  }

  const stateProps = useDefaultOverlay()

  const renderMenu = () => {
    if (isDesktop) {
      return (
        <div className="c-header-simple-nav__item__locale">
          <Dropdown
            closeOnDropdownClick={false}
            ariaLabel={t('Country and language configuration')}
            className="c-person-dropdown"
            id="headerLocaleDropdown"
            position="right"
            text={
              <div className="c-header-simple-nav__item__locale">
                <Flag country={defaultCountry} />
              </div>
            }
            {...stateProps}
          >
            <LocaleMenu />
          </Dropdown>
        </div>
      )
    }
    return (
      <Button onClick={handleClick} className="c-person-dropdown--mobile">
        {showCloseIcon ? (
          <Icon icon="close" />
        ) : (
          <div className="c-header-simple-nav__item__locale">
            <Flag country={defaultCountry} />
          </div>
        )}
      </Button>
    )
  }
  // Show an uninteractive flag if user isn't logged in or only have one web group
  // later requirements were updated to not show anything incase of static locale
  if (showStaticLocale) {
    return null
  }
  return (
    <li className="o-list-inline__item  c-header-simple-nav__item">
      {renderMenu()}
    </li>
  )
}

export default LocaleLink
