import React, { Fragment }  from 'react'
import PropTypes from 'prop-types'
import { FieldError, Label } from "@insight/toolkit-react/lib/Form/Components/Decorators";
import { RadioGroup } from "@insight/toolkit-react/lib/Form/Components/Elements";
import { Button, ButtonGroup, Field } from "@insight/toolkit-react";
import { useCreateTnCContext, useTnCsContext } from '@context'
import { useRichTextContent } from '@lib'
import { t } from 'api'

import TnCContent from './TnCContent'
import TnCSalesAgreement from './TnCSalesAgreement'

export default function TnCForm({tncAddOrEdit}) {

  const {
    actions: {
      setAgreementValid,
      setEditView,
      setPreviewView,
      setPublishedStatus,
      setSavedTNC
    },
    editView,
    errorValues,
    formValues,
    isPublished,
    previewView,
    termInProgress
  } = useCreateTnCContext()

  const {
    actions: {
      setNewTnC
    }
  } = useTnCsContext()

  const { handleChange, submitTnC } = useRichTextContent()

  const showSalesAgreement = editView && isPublished

  const agreementOptions = [
    {id: 'always', label: t('Always'), value: true},
    {id: 'once', label: t('Once'), value: false}
  ]

  const cancel = () => {
    setAgreementValid(false)
    setEditView(false)
    setNewTnC(false)
    setPreviewView(false)
    setPublishedStatus(false)
    setSavedTNC(false)
  }

  return(
    <div className='o-grid u-margin-top u-margin-bot-small u-padding-top u-padding-bot'>
      <div className="o-grid__item u-1/1">
        <div className='o-grid'>
          <div className='o-grid__item u-1/1 c-tc_heading'>
            <h3>{editView ? t('Edit Terms and Conditions') : t('Add New Terms and Conditions')}</h3>
          </div>
        </div>
        {showSalesAgreement && <TnCSalesAgreement />}
        <div className='o-grid u-padding-bot'>
          <div className='o-grid__item u-1/1'>
            <Label id={'termTypeLabel'} required htmlFor={'termTypeInput'}>
              {t('Term Type')}:
            </Label>
          </div>
          <div className='o-grid__item u-1/4'>
            <Field
              className={errorValues.type ? 'has-error' : ''}
              id={'type'}
              disabled={previewView}
              fieldComponent={'Text'}
              name={'type'}
              maxlength={65}
              value={formValues.type}
              handleChange = {handleChange}
            />
            {errorValues.type && <FieldError className="c-form__error" showErrorIcon>{t('Term Type cannot be empty.')}</FieldError>}
          </div>
        </div>
        <div className='o-grid u-1/1 u-padding-bot'>
          <div className='o-grid__item u-1/2'>
            <div className='o-grid'>
              <div className='o-grid__item u-1/1'>
                <Label id={'descLabel'} required htmlFor={'descInput'}>
                  {t('Description')}:
                </Label>
              </div>
              <div className='o-grid__item'>
                <Field
                  className={errorValues.description ? 'has-error' : ''}
                  id={'description'}
                  disabled={previewView}
                  fieldComponent={'Text'}
                  name={'description'}
                  maxlength={65}
                  value={formValues.description}
                  handleChange = {handleChange}
                />
                {errorValues.description && <FieldError className="c-form__error" showErrorIcon>{t('Description cannot be empty.')}</FieldError>}
              </div>
            </div>
          </div>
          <div className='o-grid__item u-1/2'>
            <div className='o-grid'>
              <div className='o-grid__item u-1/1'>
                <Label id={'agreementLabel'} required htmlFor={'agreementInput'}>
                  {t('Customer must accept the Agreement')}:
                </Label>
              </div>
              <div className='o-grid__item u-1/1'>
                <RadioGroup
                  disabled={previewView}
                  id={'alwaysAgree'}
                  name={'alwaysAgree'}
                  options={agreementOptions}
                  value={formValues.alwaysAgree}
                  onChange = {handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <TnCContent />
        {/* Submit buttons */}
        <div className='o-grid u-margin-bot'>
          <div className='o-grid__item c-tc__tncSubmit'>
            <ButtonGroup align="right">
              <Button color="secondary" onClick={() => cancel()} >{t('Cancel')}</Button>
              <Button color="primary" isLoading={ termInProgress } onClick={() => submitTnC(editView)}>{editView? t('Save changes') : t('Add new')}</Button>
            </ButtonGroup>
          </div>
        </div>
        {/* End of buttons */}
      </div>
    </div>
  )
}

TnCForm.propTypes = {
  tncAddOrEdit: PropTypes.func.isRequired
}
