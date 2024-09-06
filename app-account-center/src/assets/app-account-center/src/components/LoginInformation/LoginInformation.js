import React, {useState, useEffect} from 'react'

import { t } from '@insight/toolkit-utils/lib/labels'
import Panel from '@insight/toolkit-react/lib/Panel/Panel'
import Loading from "@insight/toolkit-react/lib/Loading/Loading";
import TextView from '@insight/toolkit-react/lib/TextView/TextView'
import { getPasswordStrength } from "@insight/toolkit-utils/lib/helpers";
import {
  INVALID_CURRENT_PASSWORD,
  LOGIN_ID_NOT_FOUND,
  LOGIN_INFO_UPDATED_SUCCESSFULLY,
  OLD_PASSWORD_USED,
  PASSWORD_MISMATCH,
  SAME,
  UNAVAILABLE } from '@constants'
import StaticFormField from '../StaticFormField'
import { LoginInformationModal } from '../Modal/LoginInformationModal'
import {checkUserNameAvailability, fetchLoginInformation, updatePassword, updateUserName} from "../../api";

const LoginInformation = ({addToast}) =>  {
  const [isLoading, setIsLoading] = useState(true)
  const [info, setInfo] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [userNameAvailabilityStatus, setUserNameAvailabilityStatus] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [currentPasswordError, setCurrentPasswordError] = useState('')

  useEffect(()=>{
    fetchLoginInformation().then((data)=>{
      setInfo(data)
      setIsLoading(false)
    })
  }, [])

  const editLoginInfo = () => {
    setModalIsOpen(true)
  }

  const onClose = () => {
    setModalIsOpen(false)
    setNewPasswordError('')
    setCurrentPasswordError('')
  }

  const handleUserNamePassword = (password, values, isSameUserName) => {
    updatePassword(JSON.stringify(password)).then(() => {
      if(isSameUserName){
        onClose()
        addToast({message: t(LOGIN_INFO_UPDATED_SUCCESSFULLY), type:'success'})
      }else{
        updateUserName(values.userName).then((data) => {
          setInfo(data)
          onClose()
          addToast({message: t(LOGIN_INFO_UPDATED_SUCCESSFULLY), type:'success'})
        }).catch((error)=>{
          const errorMsg = error.response.data
          if(errorMsg.code === 'DUPLICATE_USERNAME_EMAIL' || errorMsg.code === 'LOGIN_ID_IS_MISSING'){
            setUserNameAvailabilityStatus(UNAVAILABLE)
          }else{
            onClose()
            addToast({message: t('Failed to update Username'), type:'warning'})
          }
        })
      }
    }).catch(error => {
      const errorMsg = error.response.data
      if(errorMsg.code === 'LOGIN_ID_OLD_PASSWORD_USED'){
        setNewPasswordError(OLD_PASSWORD_USED)
      }else if(errorMsg.code === 'PASSWORD_POLICY_MISMATCH'){
        setNewPasswordError(PASSWORD_MISMATCH)
      }else if(errorMsg.code === 'LOGIN_ID_PASSWORD_MISMATCH'){
        setCurrentPasswordError(INVALID_CURRENT_PASSWORD)
      }else{
        onClose()
        if(errorMsg.code === 'LOGIN_ID_NOT_FOUND'){
          addToast({message: t(LOGIN_ID_NOT_FOUND), type:'warning'})
        }else{
          addToast({message: t('Failed to update Password'), type:'warning'})
        }
      }
    })
  }

  const handleSubmit = (values) => {
    setCurrentPasswordError('')
    setNewPasswordError('')
    /* If both current & new password is empty then check for user name */
    if(values.currentPassword === '' && values.newPassword === ''){
      /** **get latest info state value from values.info to work around submit handler cache issue ** */
      if(values.userName === values.info.userName){
        /* Stop updating username if the username is not updated */
        setUserNameAvailabilityStatus(SAME)
      }else{
        updateUserName(values.userName).then((data) => {
          setInfo(data)
          onClose()
          addToast({message: t(LOGIN_INFO_UPDATED_SUCCESSFULLY), type:'success'})
        }).catch((error)=>{
          const errorMsg = error.response.data
          if(errorMsg.code === 'DUPLICATE_USERNAME_EMAIL' || errorMsg.code === 'LOGIN_ID_IS_MISSING'){
            setUserNameAvailabilityStatus(UNAVAILABLE)
          }else{
            onClose()
            addToast({message: t('Failed to update Username'), type:'warning'})
          }
        })
      }
    }else{
      /* If all fields are entered - Username, current & new password */
       const password = {oldPassword: values.currentPassword, newPassword: values.newPassword}
      if(values.userName === values.info.userName){
        /* Stop updating username if the username is not updated */
        setUserNameAvailabilityStatus(SAME)
        const passwordStrength = getPasswordStrength(values.newPassword)
        /* Save password only when its strong or good */
        if(passwordStrength === 'strong' || passwordStrength === 'good'){
          handleUserNamePassword(password, values, true)
        }else{
          setNewPasswordError(PASSWORD_MISMATCH)
        }
      }else{
        let domain = document.domain
        if (domain.indexOf('.insight.com') > -1) {
          domain = domain.split('.insight.com')[0];
        }
        /** If user name is different from current username and password fields are entered then
         * 1. Trigger check Availability call to see if the new username is available
         * 2. If its available, trigger password call to create password
         * 3. If password is created successfully, then trigger update username
         * */
        checkUserNameAvailability(domain, values.userName).then((data) => {
          if(data){
            const passwordStrength = getPasswordStrength(values.newPassword)
            if(passwordStrength === 'strong' || passwordStrength === 'good'){
              handleUserNamePassword(password, values, false)
            }else{
              setNewPasswordError(PASSWORD_MISMATCH)
            }
          }else{
            setUserNameAvailabilityStatus(UNAVAILABLE)
          }
        })
      }
    }
  }

  return (
    <div className='c-login-information c-panel-border'>
      <Panel>
        <Panel.Title className='c-ac-panel-title'>
          <Panel.Title.Left><h2 className='u-h5 u-text-bold u-margin-bot-none'>{t('Login information')}</h2></Panel.Title.Left>
          <Panel.Title.Button icon="create" className='c-ac-title-icon' onClick={editLoginInfo}>
            <span className='u-hide-visually' data-testid='login-info-edit-btn'>{t('Edit Login information')}</span>
          </Panel.Title.Button>
        </Panel.Title>
        <Panel.Body>
          { isLoading ?
            <Loading />
            :
            <div className='o-grid' data-private="true">
              <div className='o-grid__item u-1/1'>
                <StaticFormField
                  data-testid='userName'
                  className={'c-static-form-field'}
                  label={t('Username')}
                  value={<TextView text={info.userName} />}
                />
              </div>
              <div className='o-grid__item u-1/1'>
                <StaticFormField
                  data-testid='password'
                  className={'c-static-form-field'}
                  label={t('Password')}
                  value={info.password}
                />
              </div>
            </div>
          }
        </Panel.Body>
      </Panel>
      {modalIsOpen &&
        <LoginInformationModal
          currentPasswordError={currentPasswordError}
          onClose={onClose}
          onSubmit={handleSubmit}
          newPasswordError={newPasswordError}
          setUserNameAvailabilityStatus={setUserNameAvailabilityStatus}
          userName={info.userName}
          userNameAvailabilityStatus={userNameAvailabilityStatus}
          info={info}
        />
      }
    </div>
  )}

export default LoginInformation;
