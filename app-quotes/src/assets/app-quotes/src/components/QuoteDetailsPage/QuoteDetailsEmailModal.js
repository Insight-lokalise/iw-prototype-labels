import React, { useEffect, useRef, useState } from 'react'
import {
  ButtonGroup,
  Button,
  Field,
  Form,
  Icon,
  Modal,
} from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import cn from 'classnames'
import { getUserInformation } from 'app-api-user-service'
import { validateEmail } from '@insight/toolkit-utils'
import { emailService } from '../../api'

function isEmpty(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) return false
  }
  return true
}

const QuoteDetailsEmailModal = ({ isOpen, onClose, quoteId, addToast }) => {
  const [emails, setEmails] = useState([''])
  const [hasErrors, setHasErrors] = useState(false)
  const [formValues, setFormValues] = useState({
    yourName: '',
    email0: emails[0], //initial required email value
    emails,
    comments: '',
  })
  const isLoading = false

  const [isFormReady, setIsFormReady] = useState(false)
  const formReadyRef = useRef()
  formReadyRef.current = isFormReady

  useEffect(() => {
    getUserInformation().then(({ data }) => {
      const { firstName, lastName } = data?.userInformation
      setFormValues({
        ...formValues,
        ...{
          yourName: `${firstName} ${lastName}`,
        },
      })
      setIsFormReady(true)
    })
  }, [])

  useEffect(() => {
    const { comments, yourName } = formValues
    const result = emails.reduce((acc, cur, i) => {
      acc[`email${i}`] = cur
      return acc
    }, {})
    const newFormValues = {
      comments,
      yourName,
      ...{ emails },
      ...result,
    }
    setFormValues(newFormValues)
  }, [emails])

  const validateForm = (values) => {
    const formIsReady = formReadyRef.current

    if (!formIsReady) return {} //form was already rendering validation errors after user name fetch

    const errors = {}

    if (!values.yourName) {
      errors.yourName = t('Please enter your name')
    }

    values?.emails.forEach((email, i) => {
      if (!email) {
        errors[`email${i}`] = t('Please enter an email.')
        return errors
      }
      if (!validateEmail(email)) {
        errors[`email${i}`] = t('Please enter a valid email.')
      }
    })
    setHasErrors(!isEmpty(errors))
    return errors
  }

  const handleSubmit = async (values) => {
    try {
      await emailService({
        name: values.yourName,
        emails: values.emails,
        comment: values.comments,
        quoteId,
      })
      addToast({
        message: t('Success: Quote successfully emailed'),
        type: 'success',
      })
    }catch(e){
      addToast({
        message: t('Failed: Quote failed to send'),
        type: 'danger',
      })
    }

    onClose()
  }

  function calculateRecipientEmails() {
    return emails.map((email, i) => {
      const isFirstEmail = i === 0
      return (
        <>
          <div
            className={cn('o-grid__item u-1/1', {
              'c-email-quote-modal__additional-email': !isFirstEmail,
            })}
          >
            <Field
              fieldComponent={'Text'}
              label={isFirstEmail ? t('Recipient email(s)') : false}
              name={`email${i}`}
              onBlur={(e) => {
                const newEmails = [...emails]
                newEmails[i] = e.target.value
                setEmails(newEmails)
              }}
              data-testid="recipient-email"
              className="c-ac-recipient-email"
              required={isFirstEmail}
            />
            {!isFirstEmail && (
              <div className={'c-email-quote-modal__close-icon'}>
                <Icon
                  icon="close"
                  onClick={() => {
                    const newEmails = [...emails]
                    newEmails.splice(i, 1)
                    setEmails(newEmails)
                  }}
                  type="info"
                />
              </div>
            )}
          </div>
        </>
      )
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      data-testid={'quote-details-email-form'}
      className="c-email-quote-modal"
    >
      <Modal.Header onClick={onClose}>
        <h1 className="u-h3">{t('Email quote')}</h1>
      </Modal.Header>
      <Modal.Body id="email-quote-body">
        <Form
          initialValues={formValues}
          onSubmit={handleSubmit}
          skipValidateOnMount
          validate={validateForm}
          validateOnBlur
          render={({ handleSubmit }) => (
            <form
              onSubmit={handleSubmit}
              className="c-form"
              aria-labelledby="PreferencesHeading"
            >
              <fieldset className="c-form__group">
                <div className="o-grid o-grid--gutters-small">
                  <div className="o-grid__item u-1/1 u-margin-bot-small">
                    <Field
                      fieldComponent={'Text'}
                      label={t('Your name')}
                      name="yourName"
                      onBlur={(e) => {
                        setFormValues({
                          ...formValues,
                          ...{
                            yourName: e.target.value,
                          },
                        })
                      }}
                      checkboxLabel={t('On orders placed')}
                      className="c-ac-email-your-name"
                      data-testid="your-name"
                      required
                    />
                  </div>
                  {calculateRecipientEmails()}
                  <div className="o-grid__item u-margin-bot-small">
                    <Button
                      className="additional_email_add"
                      color="link"
                      icon="add"
                      iconPosition="left"
                      onClick={() => {
                        setEmails([...emails, ...['']])
                      }}
                      type="link"
                    >
                      {t('Add additional email')}
                    </Button>
                  </div>
                  <div className="o-grid__item u-1/1">
                    <Field
                      fieldComponent={'TextArea'}
                      label={t('Comments (optional)')}
                      name="comments"
                      onChange={(e) => {
                        setFormValues({
                          ...formValues,
                          ...{
                            comments: e.target.value,
                          },
                        })
                      }}
                      data-testid="comments"
                      className="c-ac-comments"
                    />
                  </div>
                  <div className="o-grid__item u-1/1 u-margin-bot-small comments_disclaimer">
                    <span>
                      {t(
                        'The emails entered will not be sold or used for promotional purposes.'
                      )}
                    </span>
                  </div>
                </div>
              </fieldset>
              <ButtonGroup align="right">
                <Button color="link" isLoading={isLoading} onClick={onClose}>
                  {t('Cancel')}
                </Button>
                <Button
                  color="primary"
                  isDisabled={hasErrors}
                  isLoading={isLoading}
                  data-testid="send-email"
                  onClick={handleSubmit}
                >
                  {t('Send email')}
                </Button>
              </ButtonGroup>
            </form>
          )}
        />
      </Modal.Body>
    </Modal>
  )
}

export default QuoteDetailsEmailModal
