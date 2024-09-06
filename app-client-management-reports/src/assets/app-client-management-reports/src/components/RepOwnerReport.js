import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { ButtonGroup, Button, Form, Field } from '@insight/toolkit-react'
import { FieldError, Label } from '@insight/toolkit-react/lib/Form/Components/Decorators'

import { repOwnerReport, jumpToClientManagementReports } from 'api'

export default function RepOwnerReport(props) {
  const { description } = props.location.state
  const [isPending, setIsPending] = useState(false)

  function validateInsightEmail(email) {
    return /^[A-Z0-9_][A-Z0-9'._%+-]*@insight\.com$/i.test(email);
  }

  function validateEmailList(value) {
    const result = value.split(/,|;/);
    for (let i = 0; i < result.length; i++) {
      if (!validateInsightEmail(result[i])) { return false; }
    }
    return true;
  }

  function validateForm(values) {
    const invalidEmailError = 'Please enter a valid Insight email address.'
    const errors = {}
    if (values.email === '' || values.email === undefined) {
      errors.email = invalidEmailError
    } else if (values.email !== '') {
      const inValid = !validateEmailList(values.email)
      if (inValid) {
        errors.email = invalidEmailError
      }
    }
    return errors
  }

  function handleFormSubmit(values) {
    setIsPending(true)
    repOwnerReport(values).then((data) => {
      setIsPending(false)
      alert(data)
      jumpToClientManagementReports()
    }).catch(error => {
      setIsPending(false)
    })
  }

  return (
    <div className="c-last-login-report">
      <div className="o-grid  o-grid--gutters">
        <div className="o-grid__item">
          <h4>Web Group Rep Own Report</h4>
          <p>{description}</p>
          <p>
            <abbr className="c-form__required" title="Required">*</abbr>
            Indicates required fields.
          </p>

          <Form
            validateOnBlur
            onSubmit={handleFormSubmit}
            validate={validateForm}
            render={(props) => {
              const { handleSubmit } = props
              return (
                <form onSubmit={handleSubmit}>
                  <div className="o-grid o-grid--gutters-huge">
                    <div className="o-grid__item u-1/1 u-1/2">
                      <Field
                        fieldComponent={'Text'}
                        required
                        name="email"
                      >
                        {({ fieldProps, meta }) => {
                          return (
                            <div className={cn('c-form__element', {
                              'has-error': (meta.touched && meta.error)
                            })}>
                              <Label id='email' required for="email">{'Email'}</Label>
                              <div className="c-form__control">
                                <input className="c-input" maxLength={150} id="email" type="email"  {...fieldProps} />
                                {(meta.touched && meta.error) &&
                                  <FieldError showErrorIcon>{meta.error}</FieldError>}
                              </div>
                            </div>
                          )
                        }
                        }
                      </Field>
                    </div>
                  </div>
                  <ButtonGroup align="right">
                    <Button isLoading={isPending} isDisabled={isPending} color="primary" onClick={handleSubmit}>{'Submit'}</Button>
                    <Button color="secondary" isDisabled={isPending} onClick={jumpToClientManagementReports} >{'Back'}</Button>
                  </ButtonGroup>
                </form>
              )
            }}>
          </Form>
        </div>
      </div>
    </div>
  )
}

RepOwnerReport.propTypes = {
}
