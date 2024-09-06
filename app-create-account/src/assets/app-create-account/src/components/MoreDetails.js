import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { COUNTRIES, getAccountTypes, getJobTitles } from 'api'
import { t } from '@insight/toolkit-utils'

import {ButtonGroup, Button, Form, Field } from '@insight/toolkit-react'
import { FieldError, Label } from '@insight/toolkit-react/lib/Form/Components/Decorators'
import { RadioGroup  } from '@insight/toolkit-react/lib/Form/Components/Elements'

export default function MoreDetails (props) {
  const {isPending, locale, onBack, onCreate} = props
  const [jobTitles, setJobTitles] = useState({})
  const [billingCountry, setBillingCountry] = useState(getDefaultCountryFromLocale(locale))
  const accountTypes = getAccountTypes(billingCountry)

  useEffect(() => {
    getJobTitles().then(titles => {
      setJobTitles(titles)
    })
  }, [])

  function getDefaultCountryFromLocale(locale) {
    return locale && locale.split('_')[1]
  }


  function handleBillingCountryChange(e) {
    setBillingCountry(e.target.value)
  }
  return (
        <Form
          initialValues={{accountType: "other", countryCode: billingCountry}}
          validateOnBlur={false}
          onSubmit={onCreate}
          validate={(values)=>{
            const errors = {}
            return errors
          }}
          render={(props) => {
            const {handleSubmit} = props
            return (
              <form onSubmit={handleSubmit}>
                <Field
                  fieldComponent={'Select'}
                  required
                  name="countryCode"
                  onChange={handleBillingCountryChange}
                >
                  {({ fieldProps, meta }) => {
                    return (
                      <div className={cn('c-form__element', {
                        'has-error': (meta.touched && meta.error)
                      })}>
                        <Label required for="billingCountry">{t('Billing country')}</Label>
                        <div className="c-form__control">
                          <div className="c-select-container">
                            <select className="c-select" id="billingCountry"  {...fieldProps}>
                              {COUNTRIES.map((option, idx) => {
                                const { code, value: text } = option
                                return (
                                  <option key={`billingCountry-${idx}`} value={code}>
                                    {text}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                          {(meta.touched && meta.error) &&
                          <FieldError showErrorIcon>{meta.error}</FieldError>}
                        </div>
                      </div>
                    )}
                  }
                </Field>
                <Field
                  fieldComponent={'Select'}
                  name="jobTitle"
                >
                  {({ fieldProps, meta }) => {
                    return (
                      <div className="c-form__element">
                        <Label for="jobTitle">{t('Job title')}</Label>
                        <div className="c-form__control">
                          <div className="c-select-container">
                            <select className="c-select" id="jobTitle"  {...fieldProps}>
                              <option disabled selected>{t('Please select')}</option>
                              {Object.keys(jobTitles).length > 0 && jobTitles.map((option, idx) => {
                                const { value, text } = option
                                return (
                                  <option key={`jobTitle-${idx}`} value={value}>
                                    {text}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  }
                </Field>
                <Field
                  fieldComponent={'Select'}
                  name="accountType"
                >
                  {({ fieldProps, meta }) => {
                    return (
                      <div className={cn('c-form__element', {
                        'has-error': (meta.touched && meta.error)
                      })}>
                        <Label for="shoppingFor">{t('I am shopping for:')}</Label>
                        <div className="c-form__control">
                          <div className="c-form__radio">
                            <RadioGroup {...fieldProps} options={accountTypes} />
                          </div>
                          {(meta.touched && meta.error) &&
                          <FieldError showErrorIcon>{meta.error}</FieldError>}
                        </div>
                      </div>
                    )}
                  }
                </Field>
                <ButtonGroup align="right">
                  <Button color="primary" isLoading={isPending} isDisabled={isPending} onClick={handleSubmit}>{t('Create')}</Button>
                  <Button color="secondary" isDisabled={isPending} onClick={onBack}>{t('Back')}</Button>
                </ButtonGroup>
              </form>
            )
          }}>
        </Form>
  )
}

MoreDetails.propTypes = {
  isPending: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
}
