import React, { useState } from 'react'
import { t } from '@insight/toolkit-utils';
import cn from 'classnames'
import { ButtonGroup, Button, Modal, Form, Field } from '@insight/toolkit-react'
import { FieldError, Label } from '@insight/toolkit-react/lib/Form/Components/Decorators'
import { RadioGroup } from '@insight/toolkit-react/lib/Form/Components/Elements'

const PreferencesModal = ({ isOpen, onClose, prefs, onSubmit }) => {
  const { emailFormat, orderQuotes, emailQuotes } = prefs;
  const [isOrderQuotes, setIsOrderQuotes] = useState(orderQuotes)
  const [isEmailQuotes, setIsEmailQuotes] = useState(emailQuotes)
  const isLoading = false;
  const emailFormatOptions = [
    { id: 'HTML', label: t('HTML'), value: 'HTML', className: 'c-ac-email-format-radio', 'data-testid': 'HTML' },
    { id: 'PDF', label: t('PDF'), value: 'PDF', className: 'c-ac-email-format-radio', 'data-testid': 'PDF' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      data-testid={'preferences-form'}
      closeOnOutsideClick={false}
      className='c-ac-preferences-modal'
    >
      <Modal.Header onClick={onClose}>
        <h1 className='u-h3'>{t('Preferences')}</h1>
      </Modal.Header>
      <Modal.Body id='preferences-body'>
        <Form
          initialValues={{ emailFormat, orderQuotes, emailQuotes }}
          onSubmit={onSubmit}
          skipValidateOnMount
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="c-form" aria-labelledby="PreferencesHeading">
              <fieldset className="c-form__group">
                <div className="o-grid o-grid--gutters-small">
                  <Field id="email_format" name="emailFormat">
                    {({ fieldProps, meta }) => (
                      <div className={cn('c-form__element o-grid__item u-1/1 u-margin-bot c-ac-email-format-field', {
                        'has-error': (meta.touched && meta.error)
                      })}
                      >
                        <Label id="email_format_label">{t('Email format')}</Label>
                        <div className="c-form__control">
                          <div className="c-form__radio o-grid">
                            <RadioGroup {...fieldProps} options={emailFormatOptions} />
                          </div>
                        </div>
                        {meta.touched && meta.error && <FieldError className="c-form__control-error" showErrorIcon>{meta.error}</FieldError>}
                      </div>
                    )}
                  </Field>
                  <div className='o-grid__item'>
                    <Label id="email_confirmation_label">{t('Email confirmation')}</Label>
                    <div className='o-grid o-grid--gutters-large'>
                      <div className='o-grid__item'>
                        <Field
                          checked={isOrderQuotes}
                          fieldComponent={'Checkbox'}
                          name='orderQuotes'
                          handleChange={() => {
                            setIsOrderQuotes(!isOrderQuotes)
                          }}
                          checkboxLabel={t('On orders placed')}
                          className='c-ac-email-order-checkbox'
                          data-testid='on-orders-placed'
                        />
                      </div>
                      <div className='o-grid__item' >
                        <Field
                          checked={isEmailQuotes}
                          fieldComponent={'Checkbox'}
                          name='emailQuotes'
                          handleChange={() => {
                            setIsEmailQuotes(!isEmailQuotes)
                          }}
                          checkboxLabel={t('On quotes placed')}
                          data-testid='on-quotes-placed'
                          className='c-ac-email-quote-checkbox'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <ButtonGroup align='right'>
                <Button color="link" isLoading={isLoading} onClick={onClose}>{t('Cancel')}</Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  data-testid='perferences-save-btn'
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

export default PreferencesModal;
