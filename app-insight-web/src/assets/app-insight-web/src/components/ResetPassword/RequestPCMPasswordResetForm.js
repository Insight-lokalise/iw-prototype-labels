import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import {ButtonGroup, Button, Form, Field} from '@insight/toolkit-react'

import { t, validateEmail} from "@insight/toolkit-utils";
import cn from "classnames";
import {FieldError, Label} from "@insight/toolkit-react/lib/Form/Components/Decorators";

export default function RequestPCMPasswordResetForm(props) {
  const {children, onSubmit} = props

  function validateRequestPCMPasswordResetForm(values) {
    const invalidEmailError = t('Please enter a valid email address.')
    const errors = {}
    if (values.email === '' || values.email === undefined) {
      errors.email = invalidEmailError
    } else if(values.email !== ''){
      const isInvalid = !validateEmail(values.email)
      if(isInvalid) {
        errors.email = invalidEmailError
      }
    }
    return errors
  }
  return (
    <Form
      validateOnBlur={false}
      onSubmit={onSubmit}
      validate={validateRequestPCMPasswordResetForm}
      render={({handleSubmit}) => {
        return (
          <form onSubmit={handleSubmit}>
            <Fragment>
              {children}
              <fieldset className="c-form__group">
                <Field
                  fieldComponent={'Text'}
                  required
                  name="email"
                  id="email"
                >
                  {({ fieldProps, meta }) => {
                    return (
                      <div className={cn('c-form__element', {
                        'has-error': (meta.touched && meta.error)
                      })}>
                        <Label required id={fieldProps.id} >{t('Email')}</Label>
                        <div className="c-form__control">
                          <input className="c-input" maxLength={150} type="email"  {...fieldProps} />
                          {(meta.touched && meta.error) &&
                          <FieldError showErrorIcon>{meta.error}</FieldError>}
                        </div>
                      </div>
                    )}
                  }
                </Field>
              </fieldset>
              <div className="c-request-password__buttons">
                <ButtonGroup align="right">
                  <Button color="primary" onClick={handleSubmit}>{t('Submit')}</Button>
                </ButtonGroup>
              </div>
            </Fragment>
          </form>
        )
      }}>
    </Form>
  )
}

RequestPCMPasswordResetForm.propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
}


