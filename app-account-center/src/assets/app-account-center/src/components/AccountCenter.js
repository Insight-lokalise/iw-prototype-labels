import React from 'react'
import AccountCenterHeader from './AccountCenterHeader'
import AccountCenterQuickLinks from './AccountCenterQuickLinks'
import { PersonalInformation } from './PersonalInformation'
import { LoginInformation } from './LoginInformation'
import { Preferences } from './Preferences'
import { AccountCenterAddresses } from './Address'
import { PaymentMethods } from './PaymentInformation'
import { PasswordSettings } from './PasswordSettings'
import { getCIAMFeatureFlag } from '../api'

const AccountCenter = ({ addToast }) => {
  return (
    <div className="c-account-center">
      <div className="c-account-header">
        <div className="o-grid o-grid--center">
          <div className="o-grid__item u-1/1 u-2/3@tablet">
            <AccountCenterHeader />
          </div>
          <div className="o-grid__item u-1/1 u-1/3@tablet">
            <AccountCenterQuickLinks />
          </div>
        </div>
      </div>
      <div className="o-grid o-grid--gutters-small c-account-center-tiles">
        <div className="o-grid__item u-1/1 u-1/2@desktop">
          <PersonalInformation addToast={addToast} />
        </div>
        <div className="o-grid__item u-1/1 u-1/4@desktop">
          {getCIAMFeatureFlag() ? (
            <PasswordSettings />
          ) : (
            <LoginInformation addToast={addToast} />
          )}
        </div>
        <div className="o-grid__item u-1/1 u-1/4@desktop">
          <Preferences addToast={addToast} />
        </div>
      </div>
      <div className="o-grid o-grid--gutters-small c-account-center-tiles">
        <div className="o-grid__item u-1/1 u-1/2@desktop">
          <AccountCenterAddresses />
        </div>
        <div className="o-grid__item u-1/1 u-1/2@desktop">
          <PaymentMethods />
        </div>
      </div>
    </div>
  )
}

export default AccountCenter
