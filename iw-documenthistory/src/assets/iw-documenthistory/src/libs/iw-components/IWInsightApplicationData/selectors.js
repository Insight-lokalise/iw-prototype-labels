import get from 'lodash-es/get'

export const selector_insightApplicationData = state => state.insightApplicationData
export const selectCurrencyFormat = state => selector_insightApplicationData(state).CurrencyFormat || ''

export const selectTelephoneText = state => get(selector_insightApplicationData(state), ['phoneText'], '1-800-INSIGHT')
