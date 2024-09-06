import get from 'lodash-es/get'

export const selector_insightApplicationData = state => state.insightApplicationData
export const selector_currencyFormat = state => selector_insightApplicationData(state).CurrencyFormat || ''

export const selector_telephoneText = state =>
  get(selector_insightApplicationData(state), ['phoneText'], '1-800-INSIGHT')
