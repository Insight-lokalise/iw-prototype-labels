import React, {Fragment, useState} from 'react'
import {FieldError, Label} from "@insight/toolkit-react/lib/Form/Components/Decorators";
import {Button, Field} from "@insight/toolkit-react";
import { useCreateTnCContext, useTnCsContext } from '@context'
import { useRichTextContent } from '@lib'
import { t } from 'api'

export default function TnCSalesAgreement() {

  const {
    agreementInProgress,
    agreementSavingInProgress,
    salesAgreement,
    validated
  } = useCreateTnCContext()

  const { selectedTnC } = useTnCsContext()

  const { removeAgreementId, saveAgreement, validateAgreementId } = useRichTextContent()
  const [agreement, setAgreement] = useState();

  const handleChange = (({ target: { name, value }}) => {
    setAgreement(value)
  })

  const isValid = validated !== undefined && !validated

  return(
    <Fragment>
      <div className='o-grid u-margin-bot u-padding-left c-tc__salesHeader u-padding-bot'>
        <div className='o-grid__item u-2/6'>
          <div className='o-grid u-1/1'>
            <div className='o-grid__item u-1/1 u-padding-top'>
              <Label id={'saleAgreementLabel'} required htmlFor={'salesAgreementInput'}>
                {t('Sales Agreement')}:
              </Label>
            </div>
          </div>
        </div>
        <div className='o-grid__item u-2/6 c-tc__salesSection'>
          {salesAgreement.length > 0 && <div className='o-grid u-1/1'>
            <div className='o-grid__item u-1/1 u-padding-top c-tc__salesSection'>
              <Label id={'saleAgreementAddedLabel'} htmlFor={'salesAgreementAddedInput'}>
                {t('Sales Agreement added')}:
              </Label>
            </div>
          </div>}
        </div>
        <div className='o-grid__item u-2/6'></div>
        <div className='o-grid__item u-2/6'>
          <div className='o-grid u-1/1'>
            <div className='o-grid__item u-3/4'>
              <Field
                id={'salesAgreement'}
                className={isValid ? 'has-error' : ''}
                disabled={false}
                fieldComponent={'Text'}
                name={'salesAgreement'}
                maxlength={65}
                value={agreement}
                handleChange= {handleChange}
              />
            </div>
            <div className='o-grid__item u-1/4 c-tc__salesAgreement'>
              <Button color="secondary" isLoading={ agreementInProgress } onClick={() => validateAgreementId(agreement)}>
                {t('Add')}
              </Button>
            </div>
            { isValid && <FieldError className="c-form__error" showErrorIcon>{t('Please enter valid Sales Agreement Id.')}</FieldError>}
          </div>
        </div>
        <div className='o-grid__item u-2/6 c-tc__salesSection'>
          {salesAgreement.length > 0 && <div className='o-grid__item u-1/1 c-tc__salesSection'>
            {salesAgreement.map((sales, key) => {
                return (
                  <Fragment>
                    <span className='u-margin-right'>{sales}</span> |
                    <Button color='link' className='c-tc_actionButton u-margin-left' onClick={() => removeAgreementId(key)}>{t('Delete')}</Button><br />
                  </Fragment>
                )
            })}
          </div>}
        </div>
        <div className='o-grid__item u-2/6'>
          <div className='o-grid u-margin-right'>
            <div className='o-grid__item u-1/1 u-text-right'>
              <Button color="secondary" size="small" isLoading={agreementSavingInProgress} onClick={() => saveAgreement(selectedTnC.termId)}>{t('Save agreements')}</Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
