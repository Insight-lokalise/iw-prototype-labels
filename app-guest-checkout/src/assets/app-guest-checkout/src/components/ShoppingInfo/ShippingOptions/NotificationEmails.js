import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Button from '@insight/toolkit-react/lib/Button/Button'
import ButtonGroup from '@insight/toolkit-react/lib/ButtonGroup/ButtonGroup'
import Icon from '@insight/toolkit-react/lib/Icon/Icon';
import { Field } from '@insight/toolkit-react/lib/Form/Field/Field'
import { validateEmail } from '../../../lib/AddressValidations';
import { EMAIL_INVALID_MESSAGE } from '@constants'

export default function NotificationEmails({ setEmails, emails }) {
  const emailLength = emails.length;
  const handleEmailRemoval = (indexValue) => {
    setEmails(prevEmailList => prevEmailList.filter( (item, index) => indexValue !== index ) );
  }

  const addInputField = () => {
    if(emailLength < 5) {
      setEmails(prevEmailList => [...prevEmailList, {value: '', error: undefined}])
    }
  }

  const handleEmailFiledChange = (indexIdentifier, fieldValue) => {
    setEmails( prevList => prevList.map( (item, index) => {
      if(indexIdentifier === index){
        return { ...item, value: fieldValue };
      }
      return item;
    } ) )
  }

  const handleBlurValidations = (indexIdentifier) => {
    setEmails( prevList => prevList.map( (item, index) => {
        const isEmailValid = validateEmail(item.value);
        if((index === indexIdentifier) && !isEmailValid) {
           return { ...item, error: [EMAIL_INVALID_MESSAGE] }
        } else if ((index === indexIdentifier) && isEmailValid) {
          return { ...item, error: undefined }
        }
        return item;
      }))
  }

  const emailField = (item, index) => <> <Field
    className="o-grid__item u-margin-bot-none u-3/4"
    id={`email-${index}`}
    name={`email-${index}`}
    onBlur={e => handleBlurValidations(index)}
    fieldComponent="Text"
    type="email"
    value={emails[index]?.value}
    onChange={ e => handleEmailFiledChange(index, e.target.value)}
    required
    showErrorIcon={!!(emails[index].error?.length)}
    errors={emails[index].error}
  /> </>

  const EmailDisplay = emails.map((item, index) => (
    <div className="row email-display" key={index}>
      <div className="small-12 medium-6 u-margin-bot-small">
        <div className="email-display__value-btn">
          {emailField(item, index)}
          {index !== 0 && <div className="o-grid__item u-text-left u-margin-bot-none c-icon-exclude close-icon">
            <Icon
              color="primary"
              icon="close"
              title="close"
              type="error"
              onClick={ () => handleEmailRemoval(index)}
            />
         </div>}
        </div>
      </div>
    </div>
  ))
  return (
    <section className="c-form__control notification-emails">
      {t('Notification email(s)')}
      {EmailDisplay}
      {emailLength < 5 && <div className="o-grid__item u-1/1 u-1/2@tablet">
        <ButtonGroup align="left">
          <Button
            className="o-grid__item u-text-left u-margin-bot notification-emails__btn c-icon-exclude"
            onClick={addInputField}
            color="link"
            icon="add"
            iconPosition="left"
          >
            {t('Add additional email')}
          </Button>
        </ButtonGroup>
      </div> }
    </section>
  )
}
