import React, { useEffect, useState } from 'react'

import Header from '@insight/toolkit-react/lib/Header/Header'

import { getAccountToolsMenuItems, t } from 'api'

import Submenu from '../IAHeaderMegaMenu/Submenu'
import SubmenuItems from '../IAHeaderMegaMenu/SubmenuItems'

export default function AccountTools() {
  const [activeSubMenu, setActiveSubMenu] = useState(null)
  const [accountToolsMenuItems, setAccountToolsMenuItems] = useState([])

  useEffect(() => {
    getAccountToolsMenuItems().then(menuItems => {
      setAccountToolsMenuItems(menuItems)
    })
  }, [])

  return accountToolsMenuItems.length > 0 ? (
    <Header.Flyout.MegaMenu id="headerMobileAccountTools" title={t('Account tools')}>
      <div className="c-header-mega-menu__section">
        <div className="o-wrapper">
          <div className="o-grid  o-grid--gutters-large">
            {accountToolsMenuItems.map((submenuNode, index) => (
              <div key={submenuNode.title} className="o-grid__item  u-1/1  u-width-auto@desktop">
                {submenuNode.nodes.length > 0 ? (
                  <Submenu
                    delay={0}
                    id={`${submenuNode.title}-${index}`}
                    isOpen={activeSubMenu === submenuNode.title}
                    onClose={() => setActiveSubMenu(null)}
                    onOpen={() => setActiveSubMenu(submenuNode.title)}
                    title={t(submenuNode.title)}
                    hideViewAll
                  >
                    <SubmenuItems items={submenuNode.nodes} />
                  </Submenu>
                ) : (
                  <Header.MegaMenu.Menu.Item key={submenuNode.title} href={submenuNode.href}>
                    {submenuNode.title}
                  </Header.MegaMenu.Menu.Item>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Header.Flyout.MegaMenu>
  ) : null
}
