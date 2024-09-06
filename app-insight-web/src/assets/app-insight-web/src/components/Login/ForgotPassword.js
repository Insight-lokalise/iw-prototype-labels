import React, { Fragment, useState, useEffect } from 'react'

import { getContactUsPageUrl, requestForgotPassword }  from 'api'

import { t } from '@insight/toolkit-utils/lib/labels'
import { Button } from '@insight/toolkit-react'

import Message from '@insight/toolkit-react/lib/Message/Message'

import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPassword() {
  const [messageType, setMessageType] = useState(null)
  const [messageText, setMessageText] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showContactUsLink, setShowContactUsLink] = useState(false)


  useEffect(() => {
    document.title = t('Forgot Password | Insight')
  })

  function handleSubmit(values) {
    setIsLoading(true)
    const email = values.username
    requestForgotPassword({ ...values }).then((data) => {
      setIsLoading(false)
      if (typeof data !== 'undefined') {
        switch (data) {
          case 'NOT_FOUND':
          case 'OK':
            setMessageType("success")
            setMessageText(`${t('If you have an insight.com account, an email with a link to reset your password has been sent to')} ${email}`)
            setShowContactUsLink(false)
            break;
          case 'FORBIDDEN':
            setMessageType("error")
            setMessageText(t("We partner with your organization to provide a single sign on experience. Please reach out to your internal resources for information on how to reset your internal password."))
            setShowContactUsLink(false)
            break;
          default:
            setMessageType("error")
            setMessageText(t("An error occurred. Please try again."))
            setShowContactUsLink(true)
        }
      } else {
        setMessageType("error")
        setMessageText(t("An error occurred. Please try again."))
        setShowContactUsLink(true)
      }
    }).catch(() => {
      setMessageType("error")
      setMessageText(t("An error occurred. Please try again."))
      setShowContactUsLink(true)
    })
  }

  return (
    <Fragment>
      {messageText &&
        <Message type={messageType} icon={messageType} ariaLive="assertive">
          <span className='c-login-message__text'>{messageText}</span>
          {showContactUsLink ? (
            <Button color="inline-link" href={getContactUsPageUrl()}>{t("Contact us if you need assistance")}.</Button>
          ) : null }
        </Message>
      }
      <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Fragment>
  )
}

