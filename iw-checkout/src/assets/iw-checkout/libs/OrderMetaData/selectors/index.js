import get from 'lodash-es/get'

export const selector_orderMetaData = state => get(state, 'orderMetaData', {})

export const selector_fileUploadInformation = state => get(selector_orderMetaData(state), 'file', {})
export const selector_isFileUploadPending = state => selector_fileUploadInformation(state).isPending || false
