import React, { useState, useEffect } from 'react'

import { t } from '@insight/toolkit-utils/lib/labels'
import { Button } from '@insight/toolkit-react'
import Panel from '@insight/toolkit-react/lib/Panel/Panel'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import TextView from '@insight/toolkit-react/lib/TextView/TextView'
import StaticFormField from '../StaticFormField'
import { ChangeAccountModal } from '../Modal/ChangeAccountModal'
import { ChangeAccountConfirmation } from '../Modal/ChangeAccountConfirmationModal'
import {
  switchAccount,
  getAccounts,
  fetchPersonalInformation,
  savePersonalInfo,
  updateUserName,
  getCIAMFeatureFlag,
} from '../../api'
import { UNAVAILABLE } from '@constants'

import PersonalInformationModal from './PersonalInformationModal'

const PersonalInformation = ({ addToast }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [info, setInfo] = useState(null)
  const [accounts, setAccounts] = useState({
    results: [],
    totalResults: 0,
  })
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [accountModalIsOpen, setAccountModalIsOpen] = useState(false)
  const [changeAccountId, setChangeAccountId] = useState(null)
  const [accountConfirmationModalIsOpen, setConfirmationModalIsOpen] =
    useState(false)
  const [emailAvailabilityStatus, setEmailAvailabilityStatus] = useState('')
  const isCIAM = getCIAMFeatureFlag()

  useEffect(() => {
    fetchInfo()
  }, [])

  const fetchInfo = async () => {
    const tempInfo = await fetchPersonalInformation()
    setInfo(tempInfo)
    setIsLoading(false)

    const accountInfo = await getAccounts('', tempInfo.accountNumber)
    setAccounts(accountInfo)
  }

  const onModalClose = () => {
    setModalIsOpen(false)
  }

  const onAccountModalToggle = () => {
    setAccountModalIsOpen(!accountModalIsOpen)
  }

  const onAccountConfirmationModalToggle = () => {
    setConfirmationModalIsOpen(!accountConfirmationModalIsOpen)
  }

  const onModalSubmit = async (values) => {
    try {
      let saveSuccess = true
      await savePersonalInfo(values)

      if (isCIAM) {
        try {
          if (info.login != values.email) {
            await updateUserName(values.email)
          }
        } catch (error) {
          saveSuccess = false
          addToast({
            message: t('Failed to update Username'),
            type: 'warning',
          })
        }
      }

      if (saveSuccess) {
        onModalClose()
        addToast({
          message: t('Personal information successfully updated'),
          type: 'success',
        })
      }

      const refresh = await fetchPersonalInformation(true)
      setInfo(refresh)
    } catch (error) {
      const errorMsg = error.response.data
      if (
        errorMsg.code === 'DUPLICATE_USERNAME_EMAIL' ||
        errorMsg.code === 'LOGIN_ID_IS_MISSING'
      ) {
        setEmailAvailabilityStatus(UNAVAILABLE)
      } else {
        addToast({
          message: t('Failed to save personal information'),
          type: 'warning',
        })
      }
    }
  }

  const handleAccountSelect = (selection) => {
    setChangeAccountId(selection)
    onAccountModalToggle()
    onAccountConfirmationModalToggle()
  }

  const handleConfirmationSelect = () => {
    onAccountConfirmationModalToggle()
    if (changeAccountId) {
      setIsLoading(true)
      switchAccount(changeAccountId, setIsLoading)
    }
  }

  const handleConfirmationCancel = () => {
    setChangeAccountId(null)
    onAccountConfirmationModalToggle()
  }

  return (
    <div>
      <div className="c-personal-information c-panel-border">
        <Panel>
          <Panel.Title className="c-ac-panel-title">
            <Panel.Title.Left>
              <h2 className="u-h5 u-text-bold u-margin-bot-none">
                {t('Personal information')}
              </h2>
            </Panel.Title.Left>
            {!isLoading && (
              <Panel.Title.Button
                data-testid="personal-info-edit-btn"
                icon="create"
                className="c-ac-title-icon"
                onClick={() => setModalIsOpen(!modalIsOpen)}
              >
                <span className="u-hide-visually">
                  {t('Edit Personal information')}
                </span>
              </Panel.Title.Button>
            )}
          </Panel.Title>
          <Panel.Body>
            {isLoading ? (
              <Loading />
            ) : (
              <div className="o-grid" data-private="true">
                <div className="o-grid__item u-1/1 u-2/3@desktop">
                  <StaticFormField
                    data-testid="name"
                    className={'c-static-form-field'}
                    label={t('Name')}
                    value={
                      <TextView text={`${info.firstName} ${info.lastName}`} />
                    }
                  />
                </div>
                <div className="o-grid__item u-1/1 u-1/3@desktop">
                  <StaticFormField
                    data-testid="accountNumber"
                    className={'c-static-form-field'}
                    label={t('Account number')}
                  >
                    <div className="o-grid">
                      <p className="o-grid__item u-1/2  c-modal-link--no-margin-bottom">
                        {info.accountNumber || '-'}
                      </p>
                      {accounts.totalResults > 1 && (
                        <Button
                          color="link"
                          className="o-grid__item u-1/2 c-modal-link c-modal-link--max-height"
                          onClick={onAccountModalToggle}
                        >
                          <p className="c-modal-link--no-margin-bottom">
                            {t('Change')}
                          </p>
                        </Button>
                      )}
                    </div>
                  </StaticFormField>
                </div>
                <div className="o-grid__item u-1/1 u-2/3@desktop">
                  <StaticFormField
                    data-testid="email"
                    className={'c-static-form-field'}
                    label={t(isCIAM ? 'Email address (Login)' : 'Email')}
                    value={<TextView text={`${info.email || '-'}`} />}
                  />
                </div>
                <div className="o-grid__item u-1/1 u-1/3@desktop">
                  <StaticFormField
                    data-testid="phone"
                    className={'c-static-form-field'}
                    label={t('Phone')}
                    value={`${info.phoneNumber || '-'}`}
                  />
                </div>
              </div>
            )}
          </Panel.Body>
        </Panel>
        {modalIsOpen && (
          <PersonalInformationModal
            isOpen={modalIsOpen}
            onClose={onModalClose}
            info={info}
            onSubmit={onModalSubmit}
            setEmailAvailabilityStatus={setEmailAvailabilityStatus}
            emailAvailabilityStatus={emailAvailabilityStatus}
          />
        )}
        {accountModalIsOpen && (
          <ChangeAccountModal
            isOpen={accountModalIsOpen}
            onClose={onAccountModalToggle}
            accountId={info.accountNumber}
            handleSelect={handleAccountSelect}
            accounts={accounts}
          />
        )}
        {accountConfirmationModalIsOpen && (
          <ChangeAccountConfirmation
            isOpen={accountConfirmationModalIsOpen}
            onClose={onAccountModalToggle}
            onCancel={handleConfirmationCancel}
            onConfirm={handleConfirmationSelect}
            title={'Change Account'}
          />
        )}
      </div>
    </div>
  )
}

export default PersonalInformation
