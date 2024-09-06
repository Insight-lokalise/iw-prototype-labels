import React, {Fragment} from 'react'
import { t } from '@insight/toolkit-utils'

export function renderLoginWithYourExistingAccount() {
  return <Fragment>
    <a href="/insightweb/login">{t('login')}</a>
    {` ${t('with your existing account')}`}
  </Fragment>
}
export function renderRecoverUsernamePassword() {
  return <Fragment>
    {`${t('Recover your')} `}
    <a href="/insightweb/login?form=forgotUserName">{t('username')}</a>
    {` ${t('or')} `}
    <a href="/insightweb/login?form=forgotPassword">{t('password')}</a>
  </Fragment>
}
export function jumpToLogin() {
  window.location = '/insightweb/login'
}

