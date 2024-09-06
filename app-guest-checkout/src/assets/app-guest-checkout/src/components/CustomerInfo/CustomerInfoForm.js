import React from 'react'
import { Button, Form, Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import {useSelector} from "react-redux";
import { selector_userInfo } from '../../state/slices/selectors/ShoppingReqeustSelector'

export const CustomerInfoForm = ({ isLoading, onSubmit, validateForm}) => {
  const userInfo = useSelector(selector_userInfo)
  const fullName = userInfo?.name.split(';')
  const initialValues = {
    firstName: fullName?.[0].trim() || '',
    lastName: fullName?.[1].trim() || '',
    email: userInfo?.email.trim() || '',
    phoneNumber: userInfo?.phone.trim() || ''
  }

  return(
    <div className='c-guest-checkout_form'>
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validateForm}
        skipValidateOnMount
        validateOnBlur
        render={({handleSubmit}) => (
          <form onSubmit={handleSubmit} noValidate className="c-form" aria-labelledby="personalInfoHeading">
            <fieldset className="c-form__group" data-private="true">
              <div className="o-grid o-grid--gutters-small">
                <Field
                  fieldComponent='Text'
                  name='firstName'
                  label={t('First name')}
                  type="text"
                  aria-required="true"
                  required
                  minLength={1}
                  maxLength={40}
                  showErrorIcon
                  className='o-grid__item  u-1/1  u-1/2@desktop  u-margin-bot'
                  data-testid={'first-name-input'}
                />
                <Field
                  fieldComponent='Text'
                  name='lastName'
                  label={t('Last name')}
                  type="text"
                  aria-required="true"
                  required
                  minLength={1}
                  maxLength={40}
                  showErrorIcon
                  className="o-grid__item  u-1/1  u-1/2@desktop  u-margin-bot"
                  data-testid={'last-name-input'}
                />
                <Field
                  fieldComponent='Text'
                  name='email'
                  label={t('Business email')}
                  type="email"
                  aria-required="true"
                  required
                  showErrorIcon
                  className="o-grid__item  u-1/1  u-1/2@desktop  u-margin-bot"
                  data-testid={'email-input'}
                />
                <Field
                  fieldComponent='Text'
                  name='phoneNumber'
                  label={t('Phone')}
                  type="tel"
                  aria-required="true"
                  minLength={1}
                  maxLength={14}
                  required
                  showErrorIcon
                  className="o-grid__item  u-1/1  u-1/2@desktop  u-margin-bot"
                  data-testid={'phone-number-input'}
                />
              </div>
            </fieldset>
            <div className='c-guest-checkout__button'>
              <Button
                color="primary"
                isLoading={isLoading}
                data-testid='customer-info-submit-btn'
                onClick={handleSubmit}
              >
                {t('Continue')}
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  )
}
