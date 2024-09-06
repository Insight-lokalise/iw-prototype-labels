import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import JumpSite from './components/AvailableSites/JumpSite'
import ResetPCMPassword from './components/ResetPassword/ResetPCMPassword'
import RequestPCMPasswordReset from './components/ResetPassword/RequestPCMPasswordReset'
import CustomerDocuments from './components/CustomerDocuments/CustomerDocuments'
import NewRequisition from './components/NewRequisition/NewRequisition'
import Login from './components/Login/Login'
import AccountLocked from './components/Login/AccountLocked'
import PasswordExpired from './components/Login/PasswordExpired'
import ResetPassword from './components/Login/ResetPassword'
import NotFound from './components/NotFound/NotFound'

export default function RouteComponent() {
  const element = document.getElementById('react-insight-web-app')
  const loginInfo = element.dataset

  const [featureFlags, setFeatureFlags] = useState(false)
  const [isNewLoginEnabled, setIsNewLoginEnabled] = useState(false)

  const waitForFeatureFlags = (key) => {
    const flags = window[key]
    if (flags) {
      setFeatureFlags(flags)
      setIsNewLoginEnabled(flags['GNA-6591-Login'])
    } else {
      setTimeout(function() {
        waitForFeatureFlags(key)
      }, 100)
    }
  }

  useEffect(() => {
    waitForFeatureFlags("flags")
  })

	return (
  <div className='ds-v1 app-insight-web'>
    <BrowserRouter basename="/insightweb">
      <Route exact path="/jumpPage" component={JumpSite} />
      <Route exact path="/pcm/resetPCMPassword" component={ResetPCMPassword} />
      <Route exact path="/pcm/requestPCMPasswordReset" component={RequestPCMPasswordReset} />
      <Route exact path="/customerDocs" component={CustomerDocuments} />
      <Route exact path="/newRequest" component={NewRequisition} />
      <Route exact path="/404" component={NotFound} />
      {featureFlags && isNewLoginEnabled && (
        <Fragment>
          <Route exact path="/login" render={() => <Login loginInfo={loginInfo} />} />
          <Route exact path="/passwordExpired" render={() => <PasswordExpired loginInfo={loginInfo} />} />
          <Route exact path="/endUser/resetPassword" render={() => <ResetPassword loginInfo={loginInfo} />} />
          <Route exact path="/accountLocked" component={AccountLocked} />
          <Route exact path="/accountLockedLoginAs" render={() => <AccountLocked loginAsMessaging={true} />} />
        </Fragment>
      )}
    </BrowserRouter>
  </div>
	)
}
