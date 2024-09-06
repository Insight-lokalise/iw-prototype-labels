import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'

import { jumpToLogin, requestPCMPasswordReset }  from 'api'
import { t } from '@insight/toolkit-utils'
import RequestPCMPasswordResetForm from "./RequestPCMPasswordResetForm";
import AboutInsightCallout from './AboutInsightCallout'
import Icon from "@insight/toolkit-react/lib/Icon/Icon";

export default function RequestPCMPasswordReset() {

  const [errorMessage, setErrorMessage] = useState(null)

  document.title = t('Request password reset')

  const pcmClientsHelpText = t('Insight’s acquisition of PCM has expanded our ability to help your business run smarter.' +
    ' We now have more resources, deeper expertise and new relationships with clients — including you.')
  const resetPasswordHelpText = t('Please fill out the field below ' +
    'and we will send an email that will allow you to reset your password. ' +
    'You’ll unlock self-service shopping, detailed order tracking, on-demand reporting and so much more.')
  const welcomeMessage = t('Welcome to Insight')
  const emailNotFoundError = (
    <span>
      {t('We’re sorry, your PCM/OpsTrack account needs additional review with our e-commerce team to ensure a seamless migration to Insight.')}
      <br />
      {t('Please contact eCommerce@insight.com with your name, email address, phone and PCM/OpsTrack account.  We will assist you as quickly as possible.')}
    </span>
  )

  function handleSubmit(values) {
    setErrorMessage(null)
     requestPCMPasswordReset({ ...values }).then(() => {
       // success, navigate user to login page
       jumpToLogin()
     }).catch(({response, message})=>{
       const {status} = response
       setErrorMessage(status===404 ? emailNotFoundError : t(message))
     })
  }
  return (
    <div className="c-request-password o-grid o-grid--justify-around">
      <div className="o-grid__item u-1/1 u-3/4@desktop">
        <h2>{welcomeMessage}</h2>
        {errorMessage &&
        <p className="c-request-password__error">
          <Icon icon="alert" type="error" className="c-request-password__error-icon" />
          {errorMessage}
        </p>
        }
        <div className="o-grid o-grid--gutters-large">
          <div className="o-grid__item u-1/1 u-1/2@tablet">
            <RequestPCMPasswordResetForm onSubmit={handleSubmit}>
              <Fragment>
                <p>{pcmClientsHelpText}</p>
                <p>{resetPasswordHelpText}</p>
              </Fragment>
            </RequestPCMPasswordResetForm>
          </div>
          <div className="o-grid__item u-1/1 u-1/2@tablet-landscape">
            <AboutInsightCallout/>
          </div>
        </div>
      </div>
    </div>

  )
}

RequestPCMPasswordReset.propTypes = {}
