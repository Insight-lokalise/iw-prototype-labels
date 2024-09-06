export const selector_insight = state => state.insight || {}
export const selector_locale = state => selector_insight(state).locale || 'en_US'
export const selector_countryCode = state => selector_locale(state).split('_')[1]
export const selector_ipsUser = state => selector_insight(state).ipsUser
export const selector_ipsUserLogo = state => selector_insight(state).isIpsLogo
export const selector_userInformation = state => selector_insight(state).userInformation

export const selectEightHundredNumber = state => selector_insight(state).eightHundredNumber
export const selectRichRelavanceAPI = state => selector_insight(state).rrApiUrl
