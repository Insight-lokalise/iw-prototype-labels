import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import { parse } from 'query-string'

import { createPassword, jumpToLogin }  from 'api'
import { t } from '@insight/toolkit-utils'
import ResetPCMPasswordForm from "./ResetPCMPasswordForm";
import AboutInsightCallout from './AboutInsightCallout'
import Icon from "@insight/toolkit-react/lib/Icon/Icon";

export default function ResetPCMPassword(props) {

  const [errorCode, setErrorCode] = useState(null)

  document.title = t('Reset password')
  const queryParams = parse(props.location.search)
  const { token } = queryParams

  const pcmClientsHelpText = t('Insight’s acquisition of PCM has expanded our ability to help your business run smarter.' +
    ' We now have more resources, deeper expertise and new relationships with clients — including you.')
  const resetPCMPasswordHelpText = t('Please fill out the field below to create a new password that meets our security rules.' + ' ' +
    'You’ll unlock self-service shopping, detailed order tracking, on-demand reporting and so much more.')
  const resetYourPasswoprd = t('Reset your password')
  const welcomeMessage = t('Welcome to Insight')

  function handleSubmit(values) {
    setErrorCode(null)
    createPassword({...values, token}).then(() => {
      // success, navigate user to login page
      jumpToLogin()
    }).catch(({response})=>{
      const { data: {code} } = response
      setErrorCode(code)
    })
  }
  return (
    <div className="c-reset-password o-grid o-grid--justify-around">
      <div className="o-grid__item u-1/1 u-3/4@desktop">
          <h2>{welcomeMessage}</h2>
          <h4>{resetYourPasswoprd}</h4>
          {errorCode &&
            <p className="c-reset-password__error">
              <Icon icon="alert" type="error" className="c-reset-password__error-icon" />
              {t(errorCode)}
            </p>
          }
          <div className="o-grid o-grid--gutters-large">
            <div className="o-grid__item u-1/1 u-1/2@tablet">
              <ResetPCMPasswordForm onSubmit={handleSubmit}>
                <Fragment>
                  <p>{pcmClientsHelpText}</p>
                  <p>{resetPCMPasswordHelpText}</p>
                </Fragment>
              </ResetPCMPasswordForm>
            </div>
            <div className="o-grid__item u-1/1 u-1/2@tablet-landscape">
              <AboutInsightCallout/>
            </div>
          </div>
      </div>
    </div>

  )
}

ResetPCMPassword.propTypes = {}
