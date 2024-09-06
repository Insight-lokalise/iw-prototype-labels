import React from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'

import Button from '@insight/toolkit-react/lib/Button/Button'
import Form from '@insight/toolkit-react/lib/Form/Form'
import Field from '@insight/toolkit-react/lib/Form/Field/Field'

export default function ResetPasswordForm(props) {
  const { isLoading, onSubmit } = props
  const passwordError = t('The password entered does not meet our password requirements. Please try again.')

  function validateResetPasswordForm(values) {
    const errors = {}
    if (values.password === '' || values.password === undefined || values.password.length < 8 || values.password.length > 16) {
      errors.password = passwordError
    }
    return errors
  }

  return (
    <Form
      onSubmit={onSubmit}
      validate={validateResetPasswordForm}
      skipValidateOnMount
      render={({handleSubmit}) => {
        return (
          <form onSubmit={handleSubmit} className="c-login-form" aria-labelledby="loginHeading" autoComplete="off">
            <h1 id="loginHeading" className="u-h2">{t("Reset password")}</h1>
            <p>{t('Enter a new password below.')}</p>
            <fieldset className="c-form__group">
              <Field
                fieldComponent='Password'
                name='password'
                label={t('New password')}
                autoComplete="new-password"
                autoFocus
                aria-required="true"
                helpText={t('Password must be 8-16 characters and contain at least three of the following elements: uppercase letter, lowercase letter, number, and special characters of ~ ! @ # $ % ^ & * ( ).')}
                showErrorIcon
                isMeter
              />
            </fieldset>
            <Button color="primary" isLoading={isLoading} fullWidth type="submit">
              { isLoading ? t('Resetting password') : t('Reset password') }
            </Button>
          </form>
        )
      }}>
    </Form>
  )
}

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}