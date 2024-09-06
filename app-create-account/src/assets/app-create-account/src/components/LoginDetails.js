import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { checkIfExistingUserAPI, jumpToLogin } from 'api'

import {ButtonGroup, Button, Form, Field } from '@insight/toolkit-react'
import { HelpText, FieldError, Label } from '@insight/toolkit-react/lib/Form/Components/Decorators'
import { getPasswordStrength, t, validateEmail } from '@insight/toolkit-utils'
import { EmailHelpText } from './EmailHelpText'

export default function LoginDetails (props) {
  const {initialValues, onNext} = props
  const passwordHelpText = t('Password must be 8-16 characters and contain at least three of the following elements: ' +
    'uppercase letter, lowercase letter, number, and special characters of ~ ! @ # $ % ^ & * ( ).')
  const passwordError = t('Please enter a valid password.')
  const loginError = t('Please enter username.')

  const [isExistingUser, setIsExistingUser] = useState(false)
  const [isExistingUserFromOtherRegion, setIsExistingUserFromOtherRegion] = useState(false)
  const enablePasswordCreation = (!isExistingUser && !isExistingUserFromOtherRegion)

  function handleEmailChange(e) {
    const email = e.target.value
    email && checkIfExistingUserAPI(email).then(({glmUser, webUser})=>{
      setIsExistingUser(false)
      setIsExistingUserFromOtherRegion(false)
      if(glmUser && webUser) {
        setIsExistingUser(true);
      } else if(glmUser && !webUser) {
        setIsExistingUserFromOtherRegion(true)
      }
    })
  }

  function handleNext(values) {
    onNext(values, (isExistingUser || isExistingUserFromOtherRegion))
  }


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

  function validateLogin(value) {
    let error
    if (value === '' || value === undefined) {
      error = loginError
    }
    return error
  }

  function validateLoginDetailsForm(values) {
    const confirmPasswordError = t('The password and confirm password must match.')
    const invalidEmailError = t('Please enter a valid email address.')
    const errors = {}
    if(enablePasswordCreation) {
      if (values.password && values.confirm) {
        if(values.password !== values.confirm) {
          errors.confirm = confirmPasswordError
        }
      }
    }
    if (values.email === '' || values.email === undefined) {
      errors.email = invalidEmailError
    } else if(values.email !== ''){
      const inValid = !validateEmail(values.email)
      if(inValid) {
        errors.email = invalidEmailError
      }
    }
    return errors
  }

  return (
        <Form
          validateOnBlur
          initialValues={initialValues}
          onSubmit={handleNext}
          validate={validateLoginDetailsForm}
          render={(props) => {
            const {handleSubmit} = props
            return (
              <form onSubmit={handleSubmit}>
                <h4>{t('Login details')}</h4>
                <Field
                  fieldComponent={'Text'}
                  required
                  name="email"
                  onBlur={handleEmailChange}
                >
                  {({ fieldProps, meta }) => {
                    return (
                      <div className={cn('c-form__element', {
                        'has-error': (meta.touched && meta.error)
                      })}>
                        <Label required for="email">{t('Email')}</Label>
                        <div className="c-form__control">
                          <input className="c-input" maxLength={150} id="email" type="email"  {...fieldProps} />
                          {(meta.touched && meta.error) &&
                          <FieldError showErrorIcon>{meta.error}</FieldError>}
                          {(isExistingUser || isExistingUserFromOtherRegion) &&
                          <EmailHelpText isExistingUser={isExistingUser} isExistingUserFromOtherRegion={isExistingUserFromOtherRegion} />
                          }
                        </div>
                      </div>
                    )}
                  }
                </Field>
                {enablePasswordCreation &&
                <Fragment>
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
                              {strength}
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
                </Fragment>
                }
                {isExistingUserFromOtherRegion &&
                <Fragment>
                  <Field
                    fieldComponent='Text'
                    name='login'
                    validate={validateLogin}
                  >
                    {({ fieldProps, meta }) => {
                      return(
                        <div className={cn('c-form__element', {
                          'has-error': (meta.touched && meta.error)
                        })}>
                          <Label required for="username">{t('Username')}</Label>
                          <div className="c-form__control">
                            <input className="c-input" id="username" type="text" {...fieldProps} />
                            {(meta.touched && meta.error) &&
                            <FieldError showErrorIcon>{meta.error}</FieldError>}
                          </div>
                        </div>
                      )}}
                  </Field>
                  <Field
                    fieldComponent='Text'
                    name='currentPassword'
                    validate={validatePassword}
                  >
                    {({ fieldProps, meta }) => {
                      return(
                        <div className={cn('c-form__element', {
                          'has-error': (meta.touched && meta.error)
                        })}>
                          <Label required for="currentPassword">{t('Password')}</Label>
                          <div className="c-form__control">
                            <input className="c-input" id="currentPassword" type="password" {...fieldProps} />
                            {(meta.touched && meta.error) &&
                            <FieldError showErrorIcon>{meta.error}</FieldError>}
                          </div>
                        </div>
                      )}}
                  </Field>
                </Fragment>
                }
                {!isExistingUser && <Field
                  fieldComponent='Checkbox'
                  checkboxLabel={t('I would like to receive Insight email newsletters.')}
                  name={t('receiveInsightEmails')}
                  checked />
                }
                <ButtonGroup align="right">
                  <Button color="primary" onClick={handleSubmit} isDisabled={isExistingUser}>{t('Next')}</Button>
                  <Button color="secondary" onClick={jumpToLogin}>{t('Cancel')}</Button>
                </ButtonGroup>
              </form>
            )
          }}>
        </Form>
  )
}

LoginDetails.propTypes = {
  onNext: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    receiveInsightEmails: PropTypes.bool,
  })
}
