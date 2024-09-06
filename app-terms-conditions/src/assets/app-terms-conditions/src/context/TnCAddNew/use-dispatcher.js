import React  from  'react'

import { addTnCData, getSalesAgreement, saveAgreements, updateTnCData } from '@api'

import { DISPATCH_TYPES } from './constants'

export default function useDispatch(dispatch) {
  const reset = () => dispatch({ type: DISPATCH_TYPES.RESET })
  const setContent = payload => dispatch({ type: DISPATCH_TYPES.SET_CONTENT, payload })
  const setDefaultLanding = payload => dispatch({ type: DISPATCH_TYPES.SET_DEFAULT_LANDING, payload })
  const setEditView = payload => dispatch({ type: DISPATCH_TYPES.SET_EDIT_VIEW, payload })
  const setErrorValues = payload => dispatch({ type: DISPATCH_TYPES.SET_ERROR_VALUES, payload })
  const setFormSubmit = payload => dispatch({ type: DISPATCH_TYPES.SET_FORM_SUBMIT, payload })
  const setFormValues = payload => dispatch({ type: DISPATCH_TYPES.SET_FORM_VALUES, payload })
  const termInProgress = () => dispatch({ type: DISPATCH_TYPES.TERM_INPROGRESS })
  const setPreviewView = payload => dispatch({ type: DISPATCH_TYPES.SET_PREVIEW_VIEW, payload })
  const setPublishedStatus = payload => dispatch({ type: DISPATCH_TYPES.SET_PUBLISHED_STATUS, payload })
  const setSavedTNC = payload => dispatch({ type: DISPATCH_TYPES.SET_SAVED_TNC, payload })
  const setSavedTNCFailure = payload => dispatch({ type: DISPATCH_TYPES.SET_SAVED_TNC_FAILURE, payload })
  const agreementInProgress = () => dispatch({ type: DISPATCH_TYPES.AGREEMENT_INPROGRESS })
  const deleteAgreementId = () => dispatch({ type: DISPATCH_TYPES.DELETE_AGREEMENT })
  const saveAgreementSuccess = () => dispatch({ type: DISPATCH_TYPES.SAVE_AGREEMENT_SUCCESS })
  const saveAgreementFailure = payload => dispatch({ type: DISPATCH_TYPES.SAVE_AGREEMENT_FAILURE, payload })
  const saveAgreementInProgress = () => dispatch({ type: DISPATCH_TYPES.SAVE_AGREEMENT_INPROGRESS })
  const setAgreementValid = payload => dispatch({ type: DISPATCH_TYPES.SET_AGREEMENT_VALID, payload })
  const setAgreementValidFailure = payload => dispatch({ type: DISPATCH_TYPES.SET_AGREEMENT_VALID_FAILURE, payload})
  const setAgreementIds = payload => dispatch({ type: DISPATCH_TYPES.SET_AGREEMENT_IDS, payload })
  const getAgreementIds = payload => dispatch({ type: DISPATCH_TYPES.GET_AGREEMENT_IDS, payload })
  const setUpdatedTNC = payload => dispatch({ type: DISPATCH_TYPES.SET_UPDATED_TNC, payload })

  const setValidatedStatus = payload => dispatch({ type: DISPATCH_TYPES.SET_VALIDATED_STATUS, payload })

  async function saveTnC(formValues, salesArea) {
    const { data, success } = await addTnCData(formValues, salesArea)
    const dispatchMethod = success === true
      ? setSavedTNC
      : setSavedTNCFailure

    dispatchMethod(data)
    return { data, success }
  }

  async function saveAgreementIds(revisionId, agreements) {
    saveAgreementInProgress()
    const { data, success } = await saveAgreements(revisionId, agreements)
    const dispatchMethod = success === true
      ? saveAgreementSuccess
      : saveAgreementFailure

    dispatchMethod(data.success)
    return { data, success }
  }

  async function updateTnC(formValues, termObj) {
    const { data, success } = await updateTnCData(formValues, termObj)
    const dispatchMethod = success === true
      ? setUpdatedTNC
      : setSavedTNCFailure

    dispatchMethod(data)
    return { data, success }
  }

  async function validateSalesAgreement(agreementId){
    agreementInProgress()
    const { data, success } = await getSalesAgreement(agreementId)
    const dispatchMethod = data.success === true
      ? setAgreementValid
      : setAgreementValidFailure

    dispatchMethod(data.success)
    return { data, success }
  }

  return {
    agreementInProgress,
    deleteAgreementId,
    getAgreementIds,
    reset,
    saveAgreementIds,
    setAgreementIds,
    setAgreementValid,
    setContent,
    setDefaultLanding,
    setEditView,
    setErrorValues,
    setFormSubmit,
    setFormValues,
    setPreviewView,
    setPublishedStatus,
    setSavedTNC,
    saveTnC,
    setUpdatedTNC,
    setValidatedStatus,
    termInProgress,
    updateTnC,
    validateSalesAgreement
  }
}
