import React, { useContext, useEffect } from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import HeaderContext from '@insight/toolkit-react/lib/Header/HeaderContext'
import { Icon } from '@insight/toolkit-react'
import { getLogoutURL, handleLogout } from 'api'
import { t } from '@insight/toolkit-utils/lib/labels'
import IAHeaderContext from '../../../context/IAHeaderContext'

export default function PersonMenu() {
  const {
    headerInfo: { userInformation },
    accountSimpleMenu,
  } = useContext(IAHeaderContext)
  const { activeFlyout, setActiveFlyout } = useContext(HeaderContext)
  const removeGigyaCookieFlag = window.flags && window.flags['GNA-9532-Remove-Gigya-Cookie'];

  const { account, firstName, isCES, lastName, email, UserType } = userInformation
  const userFullName = `${firstName} ${lastName}`.trim()
  const accountId = account.displayId || account.id || ''
  const isSimplifiedCESUser = UserType === 'Limited' &&  isCES
  const truncate = (input) =>
    input?.length > 30 ? `${input.substring(0, 24)}...` : input;

  const clickHandler = (event) => {
    event.stopPropagation()
  }

  function handleSelect() {
    if (!activeFlyout) {
      setActiveFlyout(true)
    }
  }

  useEffect(() => {
    return () => {
      setActiveFlyout(null)
    }
  }, [])

  return (
    <React.Fragment>
      <ul
        isOpen={handleSelect()}
        className="o-list-bare c-person-dropdown__list u-margin-bot-none"
        onClick={clickHandler}
      >
        <div className="c-person-dropdown__header c-person-dropdown__divider-top">
          <Icon
            className="c-person-dropdown__header-logo"
            icon="insight-logo"
          />
          <div>
            <li
              className="c-person-dropdown__item c-person-dropdown__heading"
              data-private="true"
            >
              <div className="c-person-dropdown__userheading">
                {isSimplifiedCESUser ? t('Welcome') : userFullName}
              </div>
            </li>
            <li className="c-person-dropdown__subheading">
              <div title={email}>{isSimplifiedCESUser ? truncate(email) :`${t('Account #')} ${accountId}`}</div>
            </li>
          </div>
        </div>
        {accountSimpleMenu.map((item, index) => {
          return (
            <li
              key={index}
              className="c-person-dropdown__item c-person-dropdown__menuheading"
            >
              <Button
                className="c-person-dropdown__link"
                href={item.href}
                icon={item.icon}
                iconPosition="left"
              >
                {t(item.title)}
              </Button>
            </li>
          )
        })}
        <li className="c-person-dropdown__item c-person-dropdown__menuheading c-person-dropdown__divider-bottom">
          {
            removeGigyaCookieFlag ? 
              <Button
                className="c-person-dropdown__link c-person-dropdown__button"
                onClick={handleLogout}
                icon="logout"
                iconPosition="left"
              >
                {t('Logout')}
              </Button> :
              <Button
                className="c-person-dropdown__link"
                onClick={getLogoutURL}
                icon="logout"
                iconPosition="left"
              >
                {t('Logout')}
              </Button>
          }
        </li>
      </ul>
    </React.Fragment>
  )
}
