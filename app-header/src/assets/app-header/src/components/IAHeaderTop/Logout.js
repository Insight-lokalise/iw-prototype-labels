/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Header from '@insight/toolkit-react/lib/Header/Header'

import { getLogoutURL, renderB2BLogoutLink, t, handleLogout } from 'api'
import IAHeaderContext from '../../context/IAHeaderContext'
import logoutWrapper from './LogoutWrapper'
/**
 * The logout link will either be (a) a standard logout link, or (b) a special
 * 'cancel/exit' link for B2B users (US-only).
 */
export default function Logout({ wrapper, withIcon }) {
  const {
    headerInfo: {
      isLoggedIn,
      userInformation: { b2bInfo, permissions, webGroupPermissions },
    },
  } = useContext(IAHeaderContext)
  const showLink = isLoggedIn && permissions.enableLogout
  const Wrapper = withIcon ? logoutWrapper : wrapper
  const enableExit = isLoggedIn && webGroupPermissions.includes('enable_b2b_exit')
  const removeGigyaCookieFlag = window.flags && window.flags['GNA-9532-Remove-Gigya-Cookie'];

  return showLink ? (
    b2bInfo.isB2B ? (
      enableExit ? renderB2BLogoutLink(b2bInfo, t('Cancel/Exit')) : null
    ) : (
      removeGigyaCookieFlag ?
        <Wrapper onClick={handleLogout}>{t('Logout')}</Wrapper> :
        <Wrapper onClick={getLogoutURL}>
          {t('Logout')}
        </Wrapper>
    )
  ) : null
}
Logout.propTypes = {
  wrapper: PropTypes.func,
}

Logout.defaultProps = {
  wrapper: Header.Top.Item,
}
