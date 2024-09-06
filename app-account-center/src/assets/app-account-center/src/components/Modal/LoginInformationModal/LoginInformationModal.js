import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import {ButtonGroup, Button, Modal, Form, Field, Icon, Message} from '@insight/toolkit-react'
import LoginUserNameAvailability from './LoginUserNameAvailability'
import { checkUserNameAvailability } from "../../../api";

export default function LoginInformationModal(props) {
  const {
    currentPasswordError,
    onClose,
    onSubmit,
    newPasswordError,
    setUserNameAvailabilityStatus,
    userName,
    userNameAvailabilityStatus,
    info
  } = props
  const [availableUserName, setAvailableUserName] = useState(userName)

  function validateLoginInfo (formData){
    const errors = {}
    setAvailableUserName(formData.userName)
    setUserNameAvailabilityStatus('')
    if (!formData.userName) {
      errors.userName = t('Please enter user name')
    }else if(formData.userName !== ''){
      if(formData.userName.length < 6){
        errors.userName = t('The username must be at least 6 characters')
      }
    }
    if(formData.currentPassword != '' || formData.newPassword != '') {
      if(!formData.currentPassword){
        errors.currentPassword = t('Please enter current password')
      }
      if(!formData.newPassword){
        errors.newPassword = t('Please enter new password')
      }
    }
    return errors
  }

  const checkAvailability = (enteredUserName) => {
    let domain = document.domain
    if (domain.indexOf('.insight.com') > -1) {
      domain = domain.split('.insight.com')[0];
    }
    if(userName === enteredUserName){
      setUserNameAvailabilityStatus('same')
    }else{
      checkUserNameAvailability(domain, enteredUserName).then((data) => {
        if(data){
          setUserNameAvailabilityStatus('available')
        }else{
          setUserNameAvailabilityStatus('unavailable')
        }
      })
    }
  }

  return (
    <Modal isOpen onClose={onClose} size="medium" closeOnOutsideClick={false} className='c-loginInfo-modal' data-testid='login-info-form'>
      <Modal.Header onClick={onClose}>{t('Login information')}</Modal.Header>
      <Modal.Body>
        <Form
          initialValues={{ currentPassword: '', newPassword: '', userName, info }}
          onSubmit={onSubmit}
          validate={validateLoginInfo}
          skipValidateOnMount
          validateOnBlur
          render={({handleSubmit}) => {
            return (
              <form onSubmit={handleSubmit} className="c-login-form u-margin-bot" aria-labelledby="loginHeading">
                  <fieldset className="c-form__group" data-private="true">
                    <div className="o-grid">
                      <div className="o-grid__item  u-1/1 u-4/6@desktop">
                        <Field
                          fieldComponent='Text'
                          name='userName'
                          label={t('Username')}
                          type="text"
                          aria-required="true"
                          autoFocus
                          minLength={6}
                          showErrorIcon
                          required
                          data-testid={'user-name-input'}
                        />
                        <Button color="inline-link" data-testid='check-availability' className='c-user-availability u-hide@desktop' onClick={() => checkAvailability(availableUserName)}>{t("Check availability")}</Button>
                        { userNameAvailabilityStatus !== '' && <div className='c-availability'><LoginUserNameAvailability availableUserName={userNameAvailabilityStatus} /></div> }
                        <Field
                          fieldComponent='Password'
                          name='currentPassword'
                          label={t('Current password')}
                          aria-required="true"
                          showErrorIcon
                          minLength={8}
                          data-testid='current-password-input'
                        />
                        { currentPasswordError !== '' &&
                          <small className='c-availability u-text-bold'><Message type="error">{t(currentPasswordError)}</Message></small>
                        }
                        <Field
                          fieldComponent='Password'
                          name='newPassword'
                          label={t('New password')}
                          aria-required="true"
                          showErrorIcon
                          isMeter
                          minLength={8}
                          data-testid='new-password-input'
                          helpText={t('Password must be 8-16 characters and contain at least three of the following elements: uppercase letter, lowercase letter, number, and special characters of ~ ! @ # $ % ^ ( ).')}
                        />
                        { newPasswordError !== '' &&
                          <small className='c-availability u-text-bold'><Message type="error">{t(newPasswordError)}</Message></small>
                        }                     
                      </div>
                      <div className="o-grid__item u-2/6 u-show@desktop">
                        <Button color="inline-link" className='c-user-availability' onClick={() => checkAvailability(availableUserName)}>{t("Check availability")}</Button>
                      </div>
                    </div>
                  </fieldset>
                <ButtonGroup align='right'>
                  <Button color="link" onClick={onClose}>{t('Cancel')}</Button>
                  <Button color="primary" type='submit' data-testid='login-info-save-btn'>{t('Save')}</Button>
                </ButtonGroup>
              </form>
            )
          }}>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

LoginInformationModal.propTypes = {
  currentPasswordError: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  newPasswordError: PropTypes.string.isRequired,
  setUserNameAvailabilityStatus: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  userNameAvailabilityStatus: PropTypes.string.isRequired
}
