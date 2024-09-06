import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import {ButtonGroup, Button, Form, Field} from '@insight/toolkit-react'

import { getPasswordStrength, t } from "@insight/toolkit-utils";
import cn from "classnames";
import {FieldError, HelpText, Label} from "@insight/toolkit-react/lib/Form/Components/Decorators";

export default function ResetPCMPasswordForm(props) {
  const {children, onSubmit} = props
  const passwordHelpText = t('Password must be 8-16 characters and contain at least three of the following elements: ' +
    'uppercase letter, lowercase letter, number, and special characters of ~ ! @ # $ % ^ & * ( ).')
  const passwordError = t('Please enter a valid password.')

  function validatePasswordStrength(value){
    let error
    if (value === '' || value === undefined) {
      error = passwordError
    } else {
      const strength = getPasswordStrength(value)
      if( ['', 'weak' ].includes(strength)) {
        error = passwordError
      }
    }
    return error
  }

  function validatePassword(value) {
    let error
    if (value === '' || value === undefined) {
      error = passwordError
    }
    return error
  }

  function validateResetPCMPasswordForm(values) {
    const confirmPasswordError = t('The password and confirm password must match.')
    const errors = {}
    if (values.password && values.confirm) {
      if(values.password !== values.confirm) {
        errors.confirm = confirmPasswordError
      }
    }
    return errors
  }
  return (
    <Form
      validateOnBlur={false}
      onSubmit={onSubmit}
      validate={validateResetPCMPasswordForm}
      render={({handleSubmit}) => {
        return (
          <form onSubmit={handleSubmit}>
            <Fragment>
              {children}
              <fieldset className="c-form__group">
                <Field
                  fieldComponent='Text'
                  name="password"
                  required
                  skipValidateOnMount
                  validate={validatePasswordStrength}
                >
                  {({ fieldProps, meta }) => {
                    const {value} = fieldProps
                    const strength = !!value && getPasswordStrength(value)
                    return(
                      <div className={cn('c-form__element', {
                        'has-error': (meta.touched && meta.error)
                      })}>
                        <Label required for="password">{t('Password')}</Label>
                        <div className="c-form__control">
                          <input className="c-input" maxLength={16} id="password" type="password" {...fieldProps} />
                          <div className={`c-password-meter  is-${strength}`}>
                            {t(strength)}
                          </div>
                          {(meta.touched && meta.error) &&
                          <FieldError showErrorIcon>{meta.error}</FieldError>}
                          <HelpText>{passwordHelpText}</HelpText>
                        </div>
                      </div>
                    )
                  }}
                </Field>
                <Field
                  fieldComponent='Text'
                  required
                  name='confirm'
                  validate={validatePassword}
                >
                  {({ fieldProps, meta }) => {
                    return(
                      <div className={cn('c-form__element', {
                        'has-error': (meta.touched && meta.error)
                      })}>
                        <Label required for="confirm">{t('Confirm password')}</Label>
                        <div className="c-form__control">
                          <input className="c-input" maxLength={16} id="confirm" type="password" {...fieldProps} />
                          {(meta.touched && meta.error) &&
                          <FieldError showErrorIcon>{meta.error}</FieldError>}
                        </div>
                      </div>
                    )}}
                </Field>
              </fieldset>
              <div className="c-reset-password__buttons">
                <ButtonGroup align="right">
                  <Button color="primary" onClick={handleSubmit}>{t('Reset password')}</Button>
                </ButtonGroup>
              </div>
            </Fragment>
          </form>
        )
      }}>
    </Form>
  )
}

ResetPCMPasswordForm.propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
}


