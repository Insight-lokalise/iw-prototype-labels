import React, { useContext } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Header from '@insight/toolkit-react/lib/Header/Header'
import IAHeaderContext from '../../context/IAHeaderContext'
import { Icon } from '@insight/toolkit-react'

export default function AccountToolsSimple() {

  const {
    accountSimpleMenu,
  } = useContext(IAHeaderContext)

  return <>
    {accountSimpleMenu.map((item, index) => (
      <Header.Flyout.Item key={index} href={item.href} className="c-header-nav__item--person-menu">
        <Icon icon={item.icon} />
        {t(item.title)}
      </Header.Flyout.Item>
    ))}
  </>
}
