import React, { Fragment, useContext } from 'react'
import Header from '@insight/toolkit-react/lib/Header/Header'

import Cart from './Cart'
import ChatNow from './ChatNow'
import ClientAdmin from './ClientAdmin'
import CreateAccount from './CreateAccount'
import Locale from './Locale/Locale'
import Login from './Login'
import Logout from './Logout'
import Notifications from './Notifications'
import PhoneNumber from './PhoneNumber'
import SEWPContract from './SEWPContract'
import SkipLink from './SkipLink'
import Support from './Support'
import Tools from './Tools'
import IAHeaderContext from "../../context/IAHeaderContext";
import useHideCreateAccount from "../../hooks/useHideCreateAccount"

/* The top part of the header (auxiliary links, tools, language selector) */
export default function IAHeaderTop() {
  const {
    headerInfo: {
      userInformation: { b2bInfo }
    }
  } = useContext(IAHeaderContext)
  const hideLinks = !!b2bInfo && b2bInfo.isITS
  return (
    <Header.Top>
      <Header.Top.Left>
        <Header.Top.Nav>
          <PhoneNumber />
          <ChatNow />
          <SkipLink />
        </Header.Top.Nav>
      </Header.Top.Left>
      <Header.Top.Right>
        <Header.Top.Nav>
          <SEWPContract />
          <ClientAdmin />
          <Login />
          <Logout />
          {!useHideCreateAccount() &&
            <CreateAccount />
          }          
          <Tools />
          {!hideLinks &&
            <Fragment>
              <Support />
              <Locale />
              <Notifications />
            </Fragment>
          }
          <Cart />
        </Header.Top.Nav>
      </Header.Top.Right>
    </Header.Top>
  )
}

IAHeaderTop.propTypes = {}
