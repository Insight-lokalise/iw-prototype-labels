export const DISPATCH_TYPES = {
  'GET_SALES_AREA': 'GET_SALES_AREA',
  'GET_SALES_AREA_FAILURE': 'GET_SALES_AREA_FAILURE',
  'GET_TNC': 'GET_TNC',
  'GET_TNC_FAILURE': 'GET_TNC_FAILURE',
  'SAVE_TNC': 'SAVE_TNC',
  'SET_DEFAULT_TERM': 'SET_DEFAULT_TERM',
  'SET_DEFAULT_TERM_FAILURE': 'SET_DEFAULT_TERM_FAILURE',
  'SET_FORM_VALUES': 'SET_FORM_VALUES',
  'SET_NEW_TNC': 'SET_NEW_TNC',
  'SET_PUBLISH_DELETE_TNC': 'SET_PUBLISH_DELETE_TNC',
  'SET_PUBLISH_DELETE_TNC_FAILURE':'SET_PUBLISH_DELETE_TNC_FAILURE',
  'SET_SALES_AREA': 'SET_SALES_AREA',
  'SET_SELECTED_SALES_AREA':'SET_SELECTED_SALES_AREA',
  'SET_TNC': 'SET_TNC',
  'SET_TNC_TO_UPDATE': 'SET_TNC_TO_UPDATE',
  'SET_CONTENT': 'SET_CONTENT'
}

export const INITIAL_STATE = {
  content: '',
  isDefault: false,
  error: undefined,
  formValues: {},
  loading: false,
  newTnC: false,
  TnCs: {},
  salesArea: {},
  selectedLocale: 'gb',
  selectedSalesArea: 9,
  selectedTnC: {},
  tncPublish: false,
}
