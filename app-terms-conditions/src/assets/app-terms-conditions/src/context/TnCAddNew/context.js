import React, {
  createContext,
  useContext,
  useMemo,
  useReducer
} from 'react'

import { INITIAL_STATE } from './constants'
import createTnCReducer from './reducer'
import useDispatcher from './use-dispatcher'

export const CreateTnCContext = createContext({})

export function CreateTnCContextProvider(props) {
  const [state, dispatch] = useReducer(createTnCReducer, INITIAL_STATE)
  const {
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
    termInProgress,
    updateTnC,
    setValidatedStatus,
    validateSalesAgreement
  } = useDispatcher(dispatch)

  const contextValue = useMemo(() => ({
    actions: {
      agreementInProgress,
      deleteAgreementId,
      getAgreementIds,
      reset,
      saveAgreementIds,
      saveTnC,
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
      setValidatedStatus,
      termInProgress,
      updateTnC,
      validateSalesAgreement
    },
    ...state
  }), [state])

  return <CreateTnCContext.Provider value={contextValue} {...props} />
}

export function useCreateTnCContext() {
  return useContext(CreateTnCContext)
}

