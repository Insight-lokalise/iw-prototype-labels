import React, { useState } from 'react'

import { t } from '@insight/toolkit-utils'
import { getRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import Order from './Order'
import Tools from './Tools'
import Reports from './Reports'
import Personalization from './Personalization'
import Admin from './Admin'
import Support from './Support'
import { Button } from '@insight/toolkit-react'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'

const MENU_ITEMS = {
  orders: 'Orders',
  tools: 'Tools',
  reports: 'Reports',
  personal: 'Personal',
  admin: 'Admin',
  support: 'Support',
}

/* eslint-disable react/prop-types */
export default function MenuItems(props) {
  const { account, locale, handleClick } = props
  const isEMEA = getRegion('insight_current_locale') === 'EMEA'
  const [currentSelectedOption, setCurrentSelectedOption] = useState()

  const handleMenuItems = (option) => {
    setCurrentSelectedOption(currentSelectedOption !== option ? option : '')
  }

  const goToHashLink = (url) => {
    //hash links require collapsing of the menu if it is on the same page already
    handleClick()
    window.location = url
  }

  const menuObjects = [
    {
      title: 'learn',
      caption: 'aboutTrendingTopics',
      href: `/${locale}/content-and-resources.html`,
    },
    {
      title: 'solve',
      caption: 'yourChallenges',
      href: `/${locale}/what-we-do.html`,
    },
    { title: 'buy', caption: 'newProducts', href: `/${locale}/shop.html` },
    {
      title: 'manage',
      caption: 'yourCustomizedPurchasing',
      href: `/${locale}/what-we-do/supply-chain-optimization.html`,
    },
    { title: 'myCompany', caption: '', href: `/insightweb/welcome` },
    { title: account?.dashboard, caption: '', href: `/insightweb/dashboard` },
  ]
  const topSegmentItems = menuObjects.map((menu) => {
    if (menu.title !== undefined && menu.title !== '') {
      const segment = !(
        menu.title === 'myCompany' || menu.title === 'Dashboard'
      )
      return (
        <li className={segment ? 'segment' : ''}>
          <Button type="button" size="small" {...menu}>
            {t(menu.title)}
            {segment && <span className="caption">{t(menu.caption)}</span>}
          </Button>
        </li>
      )
    } else {
      return null
    }
  })

  if (!account) {
    return <></>
  }
  return (
    <main className="menu">
      <ul className="custom-menu" role="navigation" aria-label="leftNavigation">
        <>
          {topSegmentItems}
          {account.ordersObj && Object.keys(account.ordersObj)?.length > 0 && (
            <li
              className={`has-child ${
                currentSelectedOption === MENU_ITEMS.orders ? 'active' : ''
              }`}
              onClick={() => handleMenuItems(MENU_ITEMS.orders)}
            >
              <Button
                size="small"
                aria-hidden={currentSelectedOption === MENU_ITEMS.orders}
              >
                {t('Orders')}
                <Icon
                  icon={`${
                    currentSelectedOption === MENU_ITEMS.orders
                      ? 'remove'
                      : 'add'
                  }`}
                  size="large"
                  className="c-button__icon c-button__icon--right c-button-collapsor"
                />
              </Button>
              {currentSelectedOption === MENU_ITEMS.orders && (
                <ul
                  className="menu-collapse collapse"
                  aria-hidden={currentSelectedOption === MENU_ITEMS.orders}
                >
                  <Order account={account} isEMEA={isEMEA} locale={locale} />
                </ul>
              )}
            </li>
          )}

          {account.toolsObj && Object.keys(account.toolsObj)?.length > 0 && (
            <li
              className={`has-child ${
                currentSelectedOption === MENU_ITEMS.tools ? 'active' : ''
              }`}
              onClick={() => handleMenuItems(MENU_ITEMS.tools)}
            >
              <Button
                size="small"
                aria-hidden={currentSelectedOption === MENU_ITEMS.tools}
              >
                {t('Tools')}
                <Icon
                  icon={`${
                    currentSelectedOption === MENU_ITEMS.tools
                      ? 'remove'
                      : 'add'
                  }`}
                  size="large"
                  className="c-button__icon c-button__icon--right c-button-collapsor"
                />
              </Button>
              {currentSelectedOption === MENU_ITEMS.tools && (
                <ul
                  className="menu-collapse collapse"
                  aria-hidden={currentSelectedOption === MENU_ITEMS.tools}
                >
                  <Tools account={account} goToHashLink={goToHashLink} />
                </ul>
              )}
            </li>
          )}

          {account.reportsObj &&
            Object.keys(account.reportsObj)?.length > 0 && (
              <li
                className={`has-child ${
                  currentSelectedOption === MENU_ITEMS.reports ? 'active' : ''
                }`}
                onClick={() => handleMenuItems(MENU_ITEMS.reports)}
              >
                <Button
                  size="small"
                  aria-hidden={currentSelectedOption === MENU_ITEMS.reports}
                >
                  {t('reporting')}
                  <Icon
                    icon={`${
                      currentSelectedOption === MENU_ITEMS.reports
                        ? 'remove'
                        : 'add'
                    }`}
                    size="large"
                    className="c-button__icon c-button__icon--right c-button-collapsor"
                  />
                </Button>
                {currentSelectedOption === MENU_ITEMS.reports && (
                  <ul
                    className="menu-collapse collapse"
                    aria-hidden={currentSelectedOption === MENU_ITEMS.reports}
                  >
                    <Reports account={account} goToHashLink={goToHashLink} />
                  </ul>
                )}
              </li>
            )}

          {account.personalObj &&
            Object.keys(account.personalObj)?.length > 0 && (
              <li
                className={`has-child ${
                  currentSelectedOption === MENU_ITEMS.personal ? 'active' : ''
                }`}
                onClick={() => handleMenuItems(MENU_ITEMS.personal)}
              >
                <Button
                  size="small"
                  aria-hidden={currentSelectedOption === MENU_ITEMS.personal}
                >
                  {t('personalization')}
                  <Icon
                    icon={`${
                      currentSelectedOption === MENU_ITEMS.personal
                        ? 'remove'
                        : 'add'
                    }`}
                    size="large"
                    className="c-button__icon c-button__icon--right c-button-collapsor"
                  />
                </Button>
                {currentSelectedOption === MENU_ITEMS.personal && (
                  <ul
                    className="menu-collapse collapse"
                    aria-hidden={currentSelectedOption === MENU_ITEMS.personal}
                  >
                    <Personalization
                      account={account}
                      isEMEA={isEMEA}
                      locale={locale}
                      goToHashLink={goToHashLink}
                    />
                  </ul>
                )}
              </li>
            )}

          {account.adminObj && Object.keys(account.adminObj)?.length > 0 && (
            <li
              className={`has-child ${
                currentSelectedOption === MENU_ITEMS.admin ? 'active' : ''
              }`}
              onClick={() => handleMenuItems(MENU_ITEMS.admin)}
            >
              <Button
                size="small"
                aria-hidden={currentSelectedOption === MENU_ITEMS.admin}
              >
                {t('administration')}
                <Icon
                  icon={`${
                    currentSelectedOption === MENU_ITEMS.admin
                      ? 'remove'
                      : 'add'
                  }`}
                  size="large"
                  className="c-button__icon c-button__icon--right c-button-collapsor"
                />
              </Button>
              {currentSelectedOption === MENU_ITEMS.admin && (
                <ul
                  className="menu-collapse collapse"
                  aria-hidden={currentSelectedOption === MENU_ITEMS.admin}
                >
                  <Admin account={account} goToHashLink={goToHashLink} />
                </ul>
              )}
            </li>
          )}

          {account.supportObj &&
            Object.keys(account.supportObj)?.length > 0 && (
              <li
                className={`has-child ${
                  currentSelectedOption === MENU_ITEMS.support ? 'active' : ''
                }`}
                onClick={() => handleMenuItems(MENU_ITEMS.support)}
              >
                <Button
                  size="small"
                  aria-hidden={currentSelectedOption === MENU_ITEMS.support}
                >
                  {t('support')}
                  <Icon
                    icon={`${
                      currentSelectedOption === MENU_ITEMS.support
                        ? 'remove'
                        : 'add'
                    }`}
                    size="large"
                    className="c-button__icon c-button__icon--right c-button-collapsor"
                  />
                </Button>
                {currentSelectedOption === MENU_ITEMS.support &&
                  (account.supportObj.accountTeam ||
                    account.supportObj.customerDocs) && (
                    <ul
                      className="menu-collapse collapse"
                      aria-hidden={currentSelectedOption === MENU_ITEMS.support}
                    >
                      <Support account={account} />
                    </ul>
                  )}
              </li>
            )}
          <li className="segment mobile-localization">
            <a href="#" className="dropdown-link country-dropdown-link">
              {t('changeLocation')}
            </a>
          </li>
        </>
      </ul>
    </main>
  )
}
