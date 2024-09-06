import React from 'react'
import { t } from '@insight/toolkit-utils'
import { ButtonGroup, Button, Modal, Form, Field } from '@insight/toolkit-react'
import { validateEmail } from '@insight/toolkit-utils/lib/helpers/validators'
import EmailAvailability from './EmailAvailability'
import { US_PHONE_NUMBER_PATTERN } from '@constants'
import { getCIAMFeatureFlag } from '../../api'

const PersonalInformationModal = ({
  isOpen,
  onClose,
  info,
  onSubmit,
  emailAvailabilityStatus,
  setEmailAvailabilityStatus,
}) => {
  const { email, firstName, lastName, phoneNumber } = info
  const isLoading = false

  const validateForm = (values) => {
    setEmailAvailabilityStatus('')
    const invalidEmailError = t('Please enter a valid email address')
    const errors = {}
    if (!values.firstName) {
      errors.firstName = t('Please enter first name')
    }
    if (!values.lastName) {
      errors.lastName = t('Please enter last name')
    }
    if (!values.phoneNumber) {
      errors.phoneNumber = t('Please enter phone number')
    }
    if (!values.email) {
      errors.email = invalidEmailError
    } else if (values.email !== '') {
      const inValid = !validateEmail(values.email)
      if (inValid) {
        errors.email = invalidEmailError
      }
    }
    return errors
  }

  return (
    <Modal
      isOpen={isOpen}
      size="medium"
      onClose={onClose}
      data-testid={'personal-info-form'}
      closeOnOutsideClick={false}
    >
      <Modal.Header onClick={() => {}}>
        <h1 className="u-h3">{t('Personal information')}</h1>
      </Modal.Header>
      <Modal.Body id="personal-info-body">
        <Form
          initialValues={{ firstName, lastName, email, phoneNumber, info }}
          onSubmit={onSubmit}
          validate={validateForm}
          skipValidateOnMount
          validateOnBlur
          render={({ handleSubmit }) => (
            <form
              onSubmit={handleSubmit}
              className="c-form"
              aria-labelledby="personalInfoHeading"
            >
              <fieldset className="c-form__group" data-private="true">
                <div className="o-grid o-grid--gutters-small">
                  <div className="o-grid__item u-1/1 u-1/2@desktop">
                    <Field
                      fieldComponent="Text"
                      name="firstName"
                      label={t('First name')}
                      type="text"
                      aria-required="true"
                      required
                      minLength={1}
                      maxLength={40}
                      autoFocus
                      showErrorIcon
                      className="u-margin-bot"
                      data-testid={'first-name-input'}
                    />
                  </div>
                  <div className="o-grid__item u-1/1 u-1/2@desktop">
                    <Field
                      fieldComponent="Text"
                      name="lastName"
                      label={t('Last name')}
                      type="text"
                      aria-required="true"
                      required
                      minLength={1}
                      maxLength={40}
                      autoFocus
                      showErrorIcon
                      className="u-margin-bot"
                      data-testid={'last-name-input'}
                    />
                  </div>
                  <div className="o-grid__item u-1/1 u-2/3@desktop">
                    <Field
                      fieldComponent="Text"
                      name="email"
                      label={t(
                        getCIAMFeatureFlag() ? 'Email address (Login)' : 'Email'
                      )}
                      type="email"
                      aria-required="true"
                      required
                      autoFocus
                      showErrorIcon
                      className="u-margin-bot"
                      data-testid={'email-input'}
                    />
                    {emailAvailabilityStatus !== '' && (
                      <div className="c-availability">
                        <EmailAvailability
                          availableEmail={emailAvailabilityStatus}
                        />
                      </div>
                    )}
                  </div>
                  <div className="o-grid__item u-1/1 u-1/3@desktop">
                    <Field
                      fieldComponent="Text"
                      name="phoneNumber"
                      label={t('Phone')}
                      type="tel"
                      pattern={US_PHONE_NUMBER_PATTERN}
                      aria-required="true"
                      minLength={1}
                      maxLength={14}
                      required
                      autoFocus
                      showErrorIcon
                      className="u-margin-bot"
                      data-testid={'phone-number-input'}
                    />
                  </div>
                </div>
              </fieldset>
              <ButtonGroup align="right">
                <Button color="link" isLoading={isLoading} onClick={onClose}>
                  {t('Cancel')}
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  data-testid="personal-info-save-btn"
                  onClick={handleSubmit}
                >
                  {t('Save')}
                </Button>
              </ButtonGroup>
            </form>
          )}
        />
      </Modal.Body>
    </Modal>
  )
}

export default PersonalInformationModal
