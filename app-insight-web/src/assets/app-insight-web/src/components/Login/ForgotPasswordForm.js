import React from 'react'
import PropTypes from 'prop-types'

import { jumpToLogin }  from 'api'

import { t } from '@insight/toolkit-utils/lib/labels'

import Button from '@insight/toolkit-react/lib/Button/Button'
import Form from '@insight/toolkit-react/lib/Form/Form'
import Field from '@insight/toolkit-react/lib/Form/Field/Field'

export default function ForgotPasswordForm(props) {
  const { isLoading, onSubmit } = props
  const usernameError = t('Please enter a valid email or username.')

  function validateForgotPasswordForm(values) {
    const errors = {}
    if (values.username === '' || values.username === undefined) {
      errors.username = usernameError
    }
    return errors
  }

  return (
    <Form
      onSubmit={onSubmit}
      validate={validateForgotPasswordForm}
      skipValidateOnMount
      render={({handleSubmit}) => {
        return (
          <form onSubmit={handleSubmit} className="c-login-form" aria-labelledby="loginHeading">
            <h1 id="loginHeading" className="u-h2">{t("Forgot password?")}</h1>
            <p>{t(`Enter your email or username below and we'll send you an email with a link to reset your password.`)}</p>
            <fieldset className="c-form__group">
              <Field
                fieldComponent='Text'
                name='username'
                label={t('Email or username')}
                autoFocus
                aria-required="true"
                showErrorIcon
              />
            </fieldset>
            <div className="u-text-center">
              <Button color="primary" className="u-margin-bot-small" isLoading={isLoading} fullWidth type="submit">
                { isLoading ? t('Sending email') : t('Send email') }
              </Button>
              <Button color="secondary-link" onClick={()=>jumpToLogin()}>{t('Back to login')}</Button>
            </div>
          </form>
        )
      }}>
    </Form>
  )
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
