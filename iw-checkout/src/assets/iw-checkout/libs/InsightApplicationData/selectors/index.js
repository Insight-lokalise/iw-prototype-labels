import get from 'lodash-es/get'
import { getCurrentLocale, getContactNumber } from  '@insight/toolkit-utils/lib/helpers/localeHelpers'

export const selector_insightApplicationData = state => state.insightApplicationData
export const selectNumeralConfig = state => selector_insightApplicationData(state).numeralConfig || {}
export const selectCurrencyFormat = state => selector_insightApplicationData(state).CurrencyFormat || ''

export const selectTelephoneText = state => getContactNumber(getCurrentLocale("insight_current_locale"))
