import React, { useState, useEffect } from 'react'

import { getContactUsPageUrl, jumpToForgotPassword, jumpToLogin, createPassword }  from 'api'

import { t } from '@insight/toolkit-utils/lib/labels'

import Message from '@insight/toolkit-react/lib/Message/Message'

import LoginFooter from './LoginFooter'
import ResetPasswordForm from './ResetPasswordForm'
import Button from '@insight/toolkit-react/lib/Button/Button'

export default function ResetPassword({ loginInfo }) {
  const { resetPasswordError, resetPasswordToken } = loginInfo
  const [errorMessage, setErrorMessage] = useState(null)
  const [expiredMessage, setExpiredMessage] = useState(false)
  const [showContactUsLink, setShowContactUsLink] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = t('Reset Password | Insight')

    if (resetPasswordError == true || resetPasswordError == 'true' || resetPasswordToken == null || resetPasswordToken == '') {
      setExpiredMessage(true)
      setShowContactUsLink(true)
      setErrorMessage(t(`The password reset link you clicked has expired. Please check your inbox for a more recent email and follow the instructions to reset your password.`))
    } else {
      setExpiredMessage(false)
      setShowContactUsLink(false)
    }
  })

  function handleSubmit(values) {
    setIsLoading(true)
    createPassword({...values, resetPasswordToken}).then(() => {
      jumpToLogin()
    }).catch(({response}) => {
      setIsLoading(false)
      const { data: {code} } = response
      if (typeof code !== 'undefined') {
        switch (code) {
          case 'LOGIN_ID_OLD_PASSWORD_USED':
            setErrorMessage(t("Your new password must be unique to your previous five passwords. Please try again."))
            setShowContactUsLink(false)
            break;
          case 'PASSWORD_POLICY_MISMATCH':
            setErrorMessage(t("The password entered does not meet our password requirements. Please try again."))
            setShowContactUsLink(false)
            break;
          default:
            setErrorMessage(t("An error occurred. Please try again."))
            setShowContactUsLink(true)
        }
      } else {
        setErrorMessage(t("An error occurred. Please try again."))
        setShowContactUsLink(true)
      }
    })
  }

  return (
    <div className="c-login">
      <main className="c-login__inner">
        <section className="c-login-form-wrapper">
          {errorMessage &&
            <Message type="error" icon="error" ariaLive="assertive">
              <p>
                <span className='c-login-message__text'>{errorMessage}</span>
                {showContactUsLink ? (
                  <Button color="inline-link" href={getContactUsPageUrl()}>{t("Contact us if you need assistance")}.</Button>
                ) : null }
              </p>
              {expiredMessage &&
                <Button color="primary" onClick={()=>jumpToForgotPassword()}>{t("Reset password")}</Button>
              }
            </Message>
          }
          {!expiredMessage &&
            <ResetPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
          }
        </section>
      </main>
      <LoginFooter />
    </div>
  )
}
