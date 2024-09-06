import React, { useContext } from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'

import IAHeaderContext from '../../context/IAHeaderContext'
import IAHeaderMegaMenu from '../IAHeaderMegaMenu/IAHeaderMegaMenu'
import useFilteredItemMap from '../../hooks/useFilteredItemMap'

export default function DesktopNav({ isCES }) {
  const {
    menuItems: { mainNav },
  } = useContext(IAHeaderContext)

  const filteredItemMap = useFilteredItemMap()

  const renderNavItem = (navItem, i) => {
    if (navItem?.type === 'link' && !navItem?.nodes) {
      // if the type of item is link and has no nodes attached to it , it will behave as link and not dropdown
      return <Header.Nav.Desktop.Item title={navItem?.title} href={navItem?.href} target={navItem?.targetBlank ? '_blank' : '_self'} className='link-item' />
    }
    else {
      const id = `headerMega${i + 1}`
      return (
        <Header.Nav.Desktop.MegaMenu key={id} id={id} title={navItem.title}>
          <IAHeaderMegaMenu {...navItem} isCES={isCES} />
        </Header.Nav.Desktop.MegaMenu>
      )
    }
  }

  return (
    <Header.Nav.Desktop>
      {mainNav.map((item, index) => {
        return filteredItemMap[item.id] ? null : renderNavItem(item, index)
      })}
    </Header.Nav.Desktop>
  )
}

DesktopNav.propTypes = {}
