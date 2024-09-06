import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { getWebGroups, getContractResults, getAccounts } from 'api'

import IAHeaderContext from '../../context/IAHeaderContext'
import Accounts from './Accounts'
import Agreements from './Agreements'
import Contracts from './Contracts'
import Username from './Username'
import WebGroups from './WebGroups'
import FlyoutButton from './FlyoutButton'
import PCMWelcomeCheck from './PCMWelcomeCheck'
import DefaultAccountCheck from './DefaultAccountCheck'
import LeftNavigation from '../LeftNavigation/LeftNavigation'
import HeaderContext from '@insight/toolkit-react/lib/Header/HeaderContext'

export default function LoggedInBar({
  isMobile,
  isCES,
  isIPSUser,
  isCheckout,
}) {
  const [webGroupState, setWebGroupState] = useState({
    results: [],
    totalResults: 0,
  })
  const [contractState, setContractState] = useState({
    results: [],
    totalResults: 0,
  })
  const [accountState, setAccountState] = useState({
    results: [],
    totalResults: 0,
  })

  const [openFlyout, setOpenFlyout] = useState(false)
  const { setActiveFlyout } = useContext(HeaderContext)

  const {
    headerInfo: {
      isAccountToolsEnabled,
      isLimitedBuyer,
      isLoggedIn,
      userInformation,
    },
  } = useContext(IAHeaderContext)

  const {
    account,
    b2bInfo = {},
    consortiaAgreements,
    contract,
    webGroup,
  } = userInformation

  const { isB2B } = b2bInfo

  const hasContracts = contract && contract.name

  // SHOW the WebGroup/Account Bar if user is CES and not in checkout flow,  an has agreements > 1, or webgroup > 1, or accounts/sold-to > 1, or contract => 1
  const showBar =
    !isCES ||
    (isCES &&
      !isCheckout &&
      (consortiaAgreements?.length > 1 ||
        webGroupState.totalResults > 1 ||
        accountState.totalResults > 1 ||
        contractState.totalResults >= 1))

  useEffect(() => {
    if (webGroup) {
      getWebGroups('').then((webGroupsResponse) => {
        setWebGroupState(webGroupsResponse)
      })
    }
    if (account) {
      getAccounts('').then((accountResponse) => {
        setAccountState(accountResponse)
      })
    }
    if (hasContracts) {
      getContractResults('').then((contractsResponse) => {
        setContractState(contractsResponse)
      })
    }
  }, [])

  useEffect(() => {
    const headerContainer = document.body
    if (showBar && isCES) {
      headerContainer.classList.add('is-logged-in-webgroup')
    }
    return () => {
      headerContainer.classList.remove('is-logged-in-webgroup')
    }
  }, [showBar])

  const listItemClassNames = cn(
    'o-list-bare__item  c-header-nav__item  c-header-nav__item--highlight  u-1/1',
    hasContracts || consortiaAgreements ? 'u-1/4@desktop' : 'u-1/3@desktop'
  )

  const showFlyoutButton = !isCES && isAccountToolsEnabled && !isMobile

  const getFlyOutStatus = (value) => {
    setOpenFlyout(value)
    setActiveFlyout(value)
  }

  return (
    isLoggedIn &&
    showBar && (
      <nav className="c-header-account-menu" data-private="true">
        {showFlyoutButton && (
          <FlyoutButton
            openFlyout={openFlyout}
            handleOnClick={() => getFlyOutStatus(true)}
          />
        )}
        {
          <LeftNavigation
            openFlyout={openFlyout}
            userInformation={userInformation}
            setOpenFlyout={setOpenFlyout}
          />
        }
        <ul className="o-list-bare  c-header-nav__list">
          {webGroup && (
            <li className={listItemClassNames}>
              <WebGroups webGroup={webGroup} />
            </li>
          )}
          {account && !isLimitedBuyer && (
            <li className={listItemClassNames}>
              <Accounts account={account} isCES={isCES} />
            </li>
          )}
          {hasContracts && (
            <li className={listItemClassNames}>
              <Contracts contract={contract} />
            </li>
          )}
          {consortiaAgreements && (
            <li className={listItemClassNames}>
              <Agreements />
            </li>
          )}
          {!isB2B && (
            <li className={listItemClassNames}>
              <Username />
            </li>
          )}
        </ul>
        <PCMWelcomeCheck />
        {isCES && <DefaultAccountCheck account={account} />}
      </nav>
    )
  )
}

LoggedInBar.propTypes = {
  isMobile: PropTypes.bool,
  isCES: PropTypes.bool,
  isIPSUser: PropTypes.bool.isRequired,
  isCheckout: PropTypes.bool,
}

LoggedInBar.defaultProps = {
  isMobile: false,
  isCES: false,
  isCheckout: false,
}
