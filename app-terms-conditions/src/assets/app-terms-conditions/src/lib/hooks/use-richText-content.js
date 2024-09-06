import React, { useCallback } from 'react'
import { INITIAL_STATE } from '../../context/TnCAddNew/constants'
import { useTnCsContext, useCreateTnCContext } from '@context'
import { scrollTo } from '@lib'

export default function useRichTextContent() {
  const {
    actions: {
      deleteAgreementId,
      saveAgreementIds,
      setAgreementIds,
      setContent,
      setEditView,
      setErrorValues,
      setFormValues,
      setFormSubmit,
      saveTnC,
      setValidatedStatus,
      termInProgress,
      validateSalesAgreement,
      updateTnC
    }, errorValues, formValues, salesAgreement
  } = useCreateTnCContext()

  const {
    actions: {
      getTnCs,
      publishDeleteTnC,
      setDefaultTnC,
      setNewTnC
    }, selectedSalesArea, selectedTnC
  } = useTnCsContext()

  const handleChange = (({ target: { name, value }}) => {
    if(name === 'alwaysAgree'){
      setFormValues({[name]: value === 'true' })
    }
    setFormValues({[name]: value})
    setErrorValues({ [name]: value === '' })
  })

  const handleTermsTextChange = useCallback(value => {
    setContent(value)
  })

  const submitTnC = ((isEdit) => {
    const errorObj = {
      ...errorValues,
      type: formValues.type === '',
      description: formValues.description === '',
      content: formValues.content === ''
    }

    setErrorValues(errorObj)

    const postReq = {
      ...formValues,
      alwaysAgree: formValues.alwaysAgree,
      type: formValues.type,
      description: formValues.description,
      content: formValues.content
    }

    const isFormValid = Object.keys(errorObj).filter(errorField =>  {
      return errorObj[errorField]
    })

    if(isFormValid.length === 0) {
      termInProgress()
      /* Trigger API to save TnC */
      if(isEdit){
        updateTnC(postReq, { termId: selectedTnC.termId, revisionId: selectedTnC.revisionId }).then(() => {
          setFormSubmit(false)
          getTnCs(selectedSalesArea)
        })
      }else{
        saveTnC(postReq, selectedSalesArea).then(() => {
          setFormSubmit(false)
          getTnCs(selectedSalesArea)
        })
      }
    }else{
      scrollTo()
    }

  })

  const prePopulateForm = useCallback((isEdit,term) => {
    const populatedValues = {
      ...formValues,
      type: term.type,
      description: term.description,
      alwaysAgree: term.alwaysAgree,
      content: term.content
    }
    setErrorValues( INITIAL_STATE.errorValues )
    setFormValues(populatedValues)
  })

  const publishOrDeleteTerm = useCallback((isPublish, termId, revisionId) => {
    publishDeleteTnC(isPublish, termId, revisionId).then(() => {
      getTnCs(selectedSalesArea)
    })
  })

  const defaultTerm = useCallback(termId => {
    setDefaultTnC(selectedSalesArea, termId).then(() => {
      getTnCs(selectedSalesArea)
    })
  })

  const validateAgreementId = useCallback(agreementId => {
    validateSalesAgreement(agreementId).then((response) => {
      const isValidAgreement = response.data.success && !(salesAgreement.indexOf(agreementId) > -1)
      if(isValidAgreement){
        setValidatedStatus(isValidAgreement)
        setAgreementIds(agreementId)
      }else{
        setValidatedStatus(isValidAgreement)
      }
    })
  })

  const removeAgreementId = (id) => {
    salesAgreement.splice(id, 1)
    deleteAgreementId(salesAgreement)
  }

  const saveAgreement = useCallback((revisionId) => {
    const salesAgreements = {
      Consortia: salesAgreement
    }
    saveAgreementIds(revisionId, salesAgreements).then(() => {
      setEditView(false)
      setNewTnC(false)
      getTnCs(selectedSalesArea)
    })
  })

  return {
    defaultTerm,
    handleChange,
    handleTermsTextChange,
    prePopulateForm,
    publishOrDeleteTerm,
    removeAgreementId,
    saveAgreement,
    submitTnC,
    validateAgreementId
  }
}
