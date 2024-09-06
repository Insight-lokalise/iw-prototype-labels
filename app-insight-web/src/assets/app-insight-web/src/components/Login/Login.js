import React, { Fragment, useRef, useState, useEffect } from 'react'

import { getContactUsPageUrl, getLocaleFromCookie, jumpToCreateAccount, jumpToForgotPassword, jumpToPasswordExpired } from 'api'
import { getCookie, t, getEnvironmentName } from '@insight/toolkit-utils'
import { BetaModal, Button, Message } from '@insight/toolkit-react'
import { sanitize } from 'dompurify';

import LoginForm from "./LoginForm"
import LoginFooter from './LoginFooter'
import ForgotPassword from './ForgotPassword'

export default function Login({ loginInfo }) {
  const { loginForm, loginErrorStatus, loginAttempts, loginName, loginError } = loginInfo

  const [errorMessage, setErrorMessage] = useState(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showContactUsLink, setShowContactUsLink] = useState(false)
  const [showBetaModal, setShowBetaModal] = useState(false)
  const loginFormRef = useRef(null)

  const invalidPasswordMessage = t('The username, email or password you entered is not correct.')
  const loginAttemptsMessage = t('Further incorrect login attempts will result in your account being locked. After that, you will need to reset your password.')
  const accountLockedMessage = t('Your account has been locked due to too many unsuccessful attempts to login. An email has been sent to you with instructions to unlock your account.')
  const accountInactiveMessage = t('There is an issue with your account.')
  const accountOnHoldMessage = t('There is an issue with your account.')
  const genericErrorMessage = t('An error occurred. Please try again.')
  const country = getLocaleFromCookie().split('_')[1].toUpperCase()
  const displayCreateAccount = (country !== 'SE' && country !== 'NL')

  useEffect(() => {
    document.title = t('Login | Insight')

    if (loginError != '') {
      switch (loginErrorStatus) {
        case 'INVALID_PASSWORD':
          if (loginAttempts == '5') {
            setErrorMessage(loginAttemptsMessage)
            setShowContactUsLink(false)
          } else {
            setErrorMessage(invalidPasswordMessage)
            setShowContactUsLink(false)
          }
          break
        case 'ACCOUNT_LOCKED':
          setErrorMessage(accountLockedMessage)
          setShowContactUsLink(true)
          break
        case 'ACCOUNT_INACTIVE':
          setErrorMessage(accountInactiveMessage)
          setShowContactUsLink(true)
          break
        case 'ACCOUNT_HOLD':
          setErrorMessage(accountOnHoldMessage)
          setShowContactUsLink(true)
          break
        case 'PASSWORD_EXPIRED':
          jumpToPasswordExpired()
          break
        default:
          setErrorMessage(genericErrorMessage)
          setShowContactUsLink(true)
      }
    }

    if (loginForm == 'forgotPassword') {
      setErrorMessage(null)
      setShowForgotPassword(true)
    }
  })

  useEffect(() => {
    let env = getEnvironmentName(window.location.origin)
    let emailCookie = getCookie('emailTest')
    if (env !== 'prod' && !emailCookie) {
      setShowBetaModal(true);
    }
  }, [])

  function handleSubmit(values) {
    if (values.username === '' || values.username === undefined || values.password === '' || values.password === undefined) {
      setErrorMessage(invalidPasswordMessage)
    } else {
      setIsLoading(true)
      setErrorMessage(null)
      const currentLoginForm = loginFormRef.current;
      const usernameValue = currentLoginForm?.username?.value;
      if (usernameValue) {
        currentLoginForm.username.value = sanitize(usernameValue);
      }
      currentLoginForm.setAttribute("action", "/insightweb/j_spring_security_check")
      currentLoginForm.setAttribute("method", "post")
      currentLoginForm.submit()
    }
  }

  return (
    <div className="c-login">
      <main className="c-login__inner">
        <section className="c-login-form-wrapper">
          {showForgotPassword ?
            <ForgotPassword />
            :
            <Fragment>
              {errorMessage &&
                <Message type="error" icon="error" ariaLive="assertive">
                  <span className='c-login-message__text'>{errorMessage}</span>
                  {errorMessage == loginAttemptsMessage ? (
                    <Button color="inline-link" onClick={() => jumpToForgotPassword()}>{t("Why not reset it now?")}</Button>
                  ) : null}
                  {showContactUsLink ? (
                    <Button color="inline-link" href={getContactUsPageUrl()}>{t("Contact us if you need assistance")}.</Button>
                  ) : null}
                </Message>
              }
              <LoginForm onSubmit={handleSubmit} loginName={loginName} isLoading={isLoading} loginFormRef={loginFormRef} />
              {displayCreateAccount ? (
                <p className="u-text-center u-margin-bot-none">
                  {t("New to Insight? ")}
                  <Button color="inline-link" onClick={() => jumpToCreateAccount()}>
                    {t("Create an account")}
                  </Button>
                </p>
              ) : null}
            </Fragment>
          }
        </section>
        <BetaModal isOpen={showBetaModal} onClose={() => setShowBetaModal(false)} />
      </main>
      <LoginFooter />
    </div>
  )
}
