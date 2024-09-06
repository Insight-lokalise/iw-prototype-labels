import React, { useState, useEffect } from 'react'

import { getContactUsPageUrl, jumpToLogin, createPassword }  from 'api'

import { t } from '@insight/toolkit-utils/lib/labels'

import Message from '@insight/toolkit-react/lib/Message/Message'

import LoginFooter from './LoginFooter'
import PasswordExpiredForm from './PasswordExpiredForm'
import Button from '@insight/toolkit-react/lib/Button/Button'

export default function PasswordExpired({ loginInfo }) {
  const { resetPasswordToken } = loginInfo
  const [errorMessage, setErrorMessage] = useState(null)
  const [showContactUsLink, setShowContactUsLink] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = t('Password Expired | Insight')
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
              <span className='c-login-message__text'>{errorMessage}</span>
              {showContactUsLink ? (
                <Button color="inline-link" href={getContactUsPageUrl()}>{t("Contact us if you need assistance")}.</Button>
              ) : null }
            </Message>
          }
          <PasswordExpiredForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>
      </main>
      <LoginFooter />
    </div>
  )
}
