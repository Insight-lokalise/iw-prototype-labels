export * from './insightApplicationDataSelectors'
export * from './userSelectors'

export const selector_insight = state => state.insight || {}
export const selector_envConfigs = state => selector_insight(state).envConfigs
export const selector_cmsServer = state => selector_envConfigs(state).cmsServer
export const selector_locale = state => selector_insight(state).locale || 'en_US'
export const selector_countryCode = state => selector_locale(state).split('_')[1]
export const selector_ipsUser = state => selector_insight(state).ipsUser
export const selector_eightHundredNumber = state => selector_insight(state).eightHundredNumber
