import React, { useContext, useEffect, useState } from 'react'

import { getCurrentLocale } from '@insight/toolkit-utils'
import getMenuDetails from '../../api/us/getMenuDetails'
import LeftNavHeader from './LeftNavHeader'
import MenuItems from './MenuItems'
import HeaderContext from '@insight/toolkit-react/lib/Header/HeaderContext'

export default function LeftNavigation(props) {
  const { userInformation, openFlyout, setOpenFlyout } = props
  const locale = getCurrentLocale('insight_current_locale', 'insight_locale')
  const [closeFlyout, setCloseFlyout] = useState(false)
  const [account, setAccountTools] = useState()
  const [isAccountLoaded, setIsAccountLoaded] = useState(false)
  const { setActiveFlyout } = useContext(HeaderContext)

  const getMenuStatus = (value) => {
    setCloseFlyout(value)
    setOpenFlyout(false)
    setActiveFlyout(false)
  }

  const getAccountTools = async () => {
    const responseData = await getMenuDetails()
    setAccountTools(responseData?.data)
    setIsAccountLoaded(true)
  }

  useEffect(() => {
    getAccountTools()
  }, [])

  return (
    <div
      className={`c-sidebar-nav flyout ${openFlyout ? `open` : ``}`}
      aria-hidden={openFlyout}
    >
      <div id="flyoutNavPlaceholder">
        <LeftNavHeader
          account={account}
          userInformation={userInformation}
          handleClick={() => getMenuStatus(true)}
        />
        <MenuItems
          account={account}
          locale={locale}
          userInformation={userInformation}
          handleClick={() => getMenuStatus(true)}
        />
      </div>
    </div>
  )
}

LeftNavigation.defaultProps = {}
