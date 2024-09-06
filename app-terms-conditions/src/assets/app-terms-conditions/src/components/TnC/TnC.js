import React, { Fragment, useEffect }  from 'react'

import { Icon } from '@insight/toolkit-react'
import { useTnCsContext, useCreateTnCContext } from '@context'
import { APILoading, TnCForm, TnCHeader, TnCPreviewForm, TnCPublishedSection, TnCUnPublishedSection }  from '@components'
import { scrollTo, useRichTextContent } from '@lib'
import { t } from 'api'
import { INITIAL_STATE } from '../../context/TnCAddNew/constants'

export default function TnC() {
  const {
    actions: { getTnCs, setNewTnC, setTnCToUpdate },
    error,
    loading,
    newTnC,
    selectedSalesArea,
    TnCs,
    tncPublish
  } = useTnCsContext()

  const {
    actions: { getAgreementIds, reset, setEditView, setErrorValues, setPreviewView, setPublishedStatus, setSavedTNC },
    editView,
    previewView,
    tncSaved,
    tncUpdated
  } = useCreateTnCContext()

  const { prePopulateForm } = useRichTextContent()

  function tncAddOrEdit(isEdit, term) {
    if(!previewView){
      if(isEdit){
        setEditView(isEdit)
        setNewTnC(false)
        setTnCToUpdate(term)
        if(term.salesAgreement){ getAgreementIds(term.salesAgreement) }
        setPublishedStatus(term.published)
        prePopulateForm(isEdit,term)
        scrollTo()
      }else{
        setTnCToUpdate({})
        setEditView(isEdit)
        setNewTnC(!newTnC)
        setPublishedStatus(false)
        setSavedTNC(false)
        setErrorValues(INITIAL_STATE.errorValues)
        reset()
      }
    }else{
      setPreviewView(false)
    }
  }

  const isFormEditable = newTnC || editView

  return(
    <Fragment>
      <TnCHeader tncAddOrEdit={tncAddOrEdit} permission={TnCs.termsPermssionName} />
        {!newTnC &&
          <Fragment>
             {!!tncSaved && !tncPublish &&
                <div className='c-tc__success'><Icon icon="checkmark-circled" type="success" /> {t('Your T&C has been successfully added.')}</div>
            }
            {!!tncUpdated && !tncPublish &&
            <div className='c-tc__success'><Icon icon="checkmark-circled" type="success" /> {t('Your T&C has been successfully updated.')}</div>
            }
            {tncPublish &&
              <div className='c-tc__success'><Icon icon="checkmark-circled" type="success" /> {t('Your T&C has been successfully published / deleted / archived.')}</div>
            }
          </Fragment>
        }
      {isFormEditable && <TnCForm tncAddOrEdit={tncAddOrEdit} />}
      {previewView && <TnCPreviewForm />}
      <APILoading data={TnCs} error={error} loading={loading}>
        {TnCs => {
          return (
            TnCs.pubList && !newTnC && !editView && !previewView &&
              <Fragment>
                <TnCPublishedSection tncAddOrEdit={tncAddOrEdit} terms={TnCs.pubList} permission={TnCs.termsPermssionName} />
                <TnCUnPublishedSection tncAddOrEdit={tncAddOrEdit} terms={TnCs.unpubList} permission={TnCs.termsPermssionName} />
              </Fragment>
          )
        }}
      </APILoading>
    </Fragment>
  )
}
