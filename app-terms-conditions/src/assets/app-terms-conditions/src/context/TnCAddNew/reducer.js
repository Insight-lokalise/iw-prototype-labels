import { DISPATCH_TYPES, INITIAL_STATE } from './constants'

export default function createTnCReducer(state, { payload, type }) {
  switch (type) {
    case DISPATCH_TYPES.RESET: {
      return { ...state, formValues: INITIAL_STATE.formValues, tncSaved: false }
    }
    case DISPATCH_TYPES.AGREEMENT_INPROGRESS: {
      return { ...state, validationInProgress: true }
    }
    case DISPATCH_TYPES.DELETE_AGREEMENT: {
      return { ...state }
    }
    case DISPATCH_TYPES.SAVE_AGREEMENT_SUCCESS: {
      return { ...state, saveAgreementError: undefined, agreementSavingInProgress: false }
    }
    case DISPATCH_TYPES.SAVE_AGREEMENT_FAILURE: {
      return { ...state, saveAgreementError: payload, agreementSavingInProgress: false }
    }
    case DISPATCH_TYPES.SAVE_AGREEMENT_INPROGRESS: {
      return { ...state, agreementSavingInProgress: true }
    }
    case DISPATCH_TYPES.SET_AGREEMENT_VALID: {
      return { ...state, salesAgreementValid: payload, validationInProgress: false }
    }
    case DISPATCH_TYPES.SET_AGREEMENT_VALID_FAILURE: {
      return { ...state, salesAgreementValid: payload, validationInProgress: false }
    }
    case DISPATCH_TYPES.SET_AGREEMENT_IDS: {
      return { ...state, salesAgreement: [...state.salesAgreement, payload] }
    }
    case DISPATCH_TYPES.GET_AGREEMENT_IDS: {
      return { ...state, salesAgreement: payload }
    }
    case DISPATCH_TYPES.SET_DEFAULT_LANDING: {
      return { ...state, formValues: {...state.formValues, landingDefault: payload}}
    }
    case DISPATCH_TYPES.SET_ERROR_VALUES: {
      return { ...state, errorValues: {...state.errorValues, ...payload} }
    }
    case DISPATCH_TYPES.SET_FORM_VALUES: {
      return { ...state, formValues: {...state.formValues, ...payload}}
    }
    case DISPATCH_TYPES.SET_EDIT_VIEW: {
      return { ...state, editView: payload, previewView: false, salesAgreement: [], tncUpdated: false, tncSaved: false }
    }
    case DISPATCH_TYPES.SET_PREVIEW_VIEW: {
      return { ...state, editView: false, previewView: payload, tncUpdated: false, tncSaved: false }
    }
    case DISPATCH_TYPES.SET_PUBLISHED_STATUS : {
      return { ...state, isPublished: payload }
    }
    case DISPATCH_TYPES.SET_VALIDATED_STATUS: {
      return { ...state, validated: payload }
    }
    case DISPATCH_TYPES.SET_CONTENT: {
      return { ...state, formValues: {...state.formValues, content: payload}}
    }
    case DISPATCH_TYPES.SET_SAVED_TNC: {
      return { ...state, tncSaveError: undefined, termInProgress: false, tncSaved: payload, tncUpdated: false, editView: false }
    }
    case DISPATCH_TYPES.SET_UPDATED_TNC: {
      return { ...state, tncUpdateError: undefined, termInProgress: false, tncUpdated: payload, tncSaved: false, editView: false }
    }
    case DISPATCH_TYPES.SET_SAVED_TNC_FAILURE: {
      return { ...state, tncSaveError: payload, termInProgress: false, tncSaved: undefined, tncUpdated: undefined }
    }
    case DISPATCH_TYPES.TERM_INPROGRESS: {
      return { ...state, tncSaveError: payload, tncUpdateError: payload, termInProgress: true }
    }
    default: {
      return state
    }
  }
}
