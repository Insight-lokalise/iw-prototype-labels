import React, { useState } from 'react'
import cn from 'classnames'

import { ButtonGroup, Button, Form, Field } from '@insight/toolkit-react'
import { FieldError, Label } from '@insight/toolkit-react/lib/Form/Components/Decorators'

import Date from './Date/Date'
import { lastLoginReport, jumpToClientManagementReports } from 'api'

export default function LastLoginReport(props) {
  const { description } = props.location.state
  const [isPending, setIsPending] = useState(false)

  function validateIfDateSelected(value) {
    let error
    if (value === '' || value === undefined) {
      error = 'Please select a date'
    }
    return error
  }

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

  function diff_years(dt2, dt1) {

    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs((diff / 365));

  }

  function validateForm(values) {
    const invalidEmailError = 'Please enter a valid Insight email address.'
    const errors = {}

    if (values.hierarchy === '' || values.hierarchy === undefined) {
      errors.hierarchy = 'Please select hierarchy'
    }

    if (values.hierarchyNumber === '' || values.hierarchyNumber === undefined) {
      errors.hierarchyNumber = 'Please select hierarchy'
    }

    if (values.email === '' || values.email === undefined) {
      errors.email = invalidEmailError
    } else if (values.email !== '') {
      const inValid = !validateEmailList(values.email)
      if (inValid) {
        errors.email = invalidEmailError
      }
    }
    if (values.startDate && values.endDate) {
      if (diff_years(values.endDate, values.startDate) > 1) {
        errors.endDate = 'Please select dates within one year.'
      }
    }
    return errors
  }

  function handleFormSubmit(values) {
    setIsPending(true)
    lastLoginReport(values).then((data) => {
      setIsPending(false)
      alert("Report will be delivered shortly.")
      jumpToClientManagementReports()
    }).catch(error => {
      setIsPending(false)
    })
  }

  return (
    <div className="c-last-login-report">
      <div className="o-grid  o-grid--gutters">
        <div className="o-grid__item">
          <h4>Last login report</h4>
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
                        fieldComponent={'Select'}
                        required
                        name="hierarchy"
                      >
                        {({ fieldProps, meta }) => {
                          return (
                            <div className={cn('c-form__element', {
                              'has-error': (meta.touched && meta.error)
                            })}>
                              <Label required for="hierarchy">Hierarchy</Label>
                              <div className="c-form__control">
                                <div className="c-select-container">
                                  <select className="c-select" id="hierarchy"  {...fieldProps}>
                                    <option value="">Please select</option>
                                    <option value="ggp">Great grand parent</option>
                                    <option value="webGroupId">Web group</option>
                                  </select>
                                </div>
                                {(meta.touched && meta.error) &&
                                  <FieldError showErrorIcon>{meta.error}</FieldError>}
                              </div>
                            </div>
                          )
                        }
                        }
                      </Field>
                    </div>
                    <div className="o-grid__item u-1/1 u-1/2">
                      <Field
                        fieldComponent='Text'
                        required
                        name='hierarchyNumber'
                      >
                        {({ fieldProps, meta }) => {
                          return (
                            <div className={cn('c-form__element', {
                              'has-error': (meta.touched && meta.error)
                            })}>
                              <Label required for="hierarchyNumber">Value</Label>
                              <div className="c-form__control">
                                <input className="c-input" maxLength={16} id="hierarchyNumber" {...fieldProps} />
                                {(meta.touched && meta.error) &&
                                  <FieldError showErrorIcon>{meta.error}</FieldError>}
                              </div>
                            </div>
                          )
                        }}
                      </Field>
                    </div>
                    <div className="o-grid__item u-1/1 u-1/2">
                      <Field
                        fieldComponent={'Text'}
                        required
                        name="startDate"
                        validate={validateIfDateSelected}
                      >
                        {({ fieldProps, meta }) => {
                          return (
                            <div className={cn('c-form__element', {
                              'has-error': (meta.touched && meta.error)
                            })}>
                              <Label required for="fromDate">From date</Label>
                              <div className="c-form__control">
                                <Date {...fieldProps} id='fromDate' />
                                {(meta.touched && meta.error) &&
                                  <FieldError showErrorIcon>{meta.error}</FieldError>}
                              </div>
                            </div>
                          )
                        }
                        }
                      </Field>
                    </div>
                    <div className="o-grid__item u-1/1 u-1/2">
                      <Field
                        fieldComponent={'Text'}
                        required
                        name="endDate"
                        validate={validateIfDateSelected}
                      >
                        {({ fieldProps, meta }) => {
                          return (
                            <div className={cn('c-form__element', {
                              'has-error': (meta.touched && meta.error)
                            })}>
                              <Label required for="toDate">To date</Label>
                              <div className="c-form__control">
                                <Date {...fieldProps} id='toDate' />
                                {(meta.touched && meta.error) &&
                                  <FieldError showErrorIcon>{meta.error}</FieldError>}
                              </div>
                            </div>
                          )
                        }
                        }
                      </Field>
                    </div>
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
                              <Label required for="email">{'Email'}</Label>
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

LastLoginReport.propTypes = {
}
