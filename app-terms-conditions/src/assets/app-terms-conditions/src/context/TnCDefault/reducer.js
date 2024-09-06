import { DISPATCH_TYPES } from './constants'

export default function TnCReducer(state, { payload, type }) {
  switch (type) {
    case DISPATCH_TYPES.GET_SALES_AREA: {
      return { ...state, error: undefined, salesAreaLoading: true }
    }
    case DISPATCH_TYPES.GET_SALES_AREA_FAILURE: {
      return { ...state, error: payload, salesAreaLoading: false }
    }
    case DISPATCH_TYPES.SET_SALES_AREA: {
      return { ...state, error: undefined, salesAreaLoading: false, salesArea: payload }
    }
    case DISPATCH_TYPES.SET_SELECTED_SALES_AREA: {
      return { ...state, selectedLocale: payload.selectedLocale, selectedSalesArea: payload.selectedSalesArea, tncPublish: false }
    }
    case DISPATCH_TYPES.GET_TNC: {
      return { ...state, error: undefined, loading: true }
    }
    case DISPATCH_TYPES.GET_TNC_FAILURE: {
      return { ...state, error: payload, loading: false }
    }
    case DISPATCH_TYPES.SET_NEW_TNC: {
      return { ...state, newTnC: payload, loading: false }
    }
    case DISPATCH_TYPES.SET_DEFAULT_TERM: {
      return { ...state, isDefault: payload }
    }
    case DISPATCH_TYPES.SET_DEFAULT_TERM_FAILURE: {
      return { ...state, isDefault: false }
    }
    case DISPATCH_TYPES.SET_PUBLISH_DELETE_TNC: {
      return { ...state, tncError: undefined, publishTnCInProgress: false, tncPublish: payload.success }
    }
    case DISPATCH_TYPES.SET_PUBLISH_DELETE_TNC_FAILURE: {
      return { ...state, tncError: payload, publishTnCInProgress: false, tncPublish: false }
    }
    case DISPATCH_TYPES.SET_TNC: {
      return { ...state, error: undefined, loading: false, TnCs: payload }
    }
    case DISPATCH_TYPES.SET_TNC_TO_UPDATE: {
      return { ...state, selectedTnC: payload, tncPublish: false }
    }
    case DISPATCH_TYPES.SET_FORM_VALUES: {
      return { ...state, formValues: {content: state.content, ...payload}}
    }
    case DISPATCH_TYPES.SET_CONTENT: {
      return { ...state, content: payload}
    }
    default: {
      return state
    }
  }
}
