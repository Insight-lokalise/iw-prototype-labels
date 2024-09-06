// TODO We shouldn't copy top level state like this, it may trigger unecessary rendering
import get from 'lodash-es/get';
import { userPermissions, webGroupPermissions } from './../permissions/index';
import { selector_ipsUserLogo } from '../../Insight/selectors/index';
import { DEFAULT_LOGGED_OUT_FEATURE_FLAG } from '../../../app/libs/constants';

export const selector_user = (state) => get(state, 'user', {})
export const selector_insight = (state) => get(state, 'insight')

export const selector_locale = (state) => get(selector_insight(state), 'locale')

export const selector_consortiaId = (state) =>
  selector_user(state).defaultConsortiaId || 0
export const selector_isAPAC = (state) => selector_user(state).isAPAC || false
export const selector_isNavy = (state) => selector_user(state).isNavy || false
export const selector_isEMEA = (state) => selector_user(state).isEMEA || false
export const selector_navySTName = (state) =>
  selector_user(state).navySTName || ''
export const selector_revisionId = (state) =>
  selector_user(state).revisionId || 0
export const selector_termsId = (state) => selector_user(state).termsId || 0
export const selector_termAcceptance = (state) =>
  selector_user(state).requiresTermsAcceptance || false
export const selector_b2bLoginInfo = (state) =>
  selector_user(state).b2bLoginInfo || {}

export const selector_consortiaAgreements = (state) => selector_user(state).consortiaAgreements || []

export const selector_sessionId = (state) =>
  selector_user(state).sessionId || ''
export const selector_defaultShippingAddress = (state) =>
  get(selector_user(state), 'defaultShippingAddress', null)
export const selector_defaultBillingAddress = (state) =>
  get(selector_user(state), 'defaultBillingAddress', null)
export const selector_defaultCarrier = (state) =>
  selector_user(state).defaultCarrier || null

export const selector_userInformation = (state) =>
  selector_user(state).userInformation || {}
export const selector_country = (state) =>
  selector_user(state)?.userInformation?.CountryCode || 'US'
export const selector_currencyCode = (state) =>
  selector_user(state)?.userInformation?.currencyCode || 'USD'
export const selector_isCES = (state) =>
  selector_userInformation(state).isCES || false
export const selector_loginAsFlag = (state) =>
  selector_userInformation(state).loginAsFlag || false
export const selector_userEmail = (state) =>
  selector_userInformation(state).Email || ''
export const selector_userSalesOrg = (state) =>
  selector_userInformation(state).salesOrg || '2400'
export const selector_cdmUid = (state) =>
  selector_userInformation(state).cdmUid || ''
export function selector_isLimitedUser(state) {
  const userInformation = selector_userInformation(state)
  return get(userInformation, ['UserType'], 'Standard') === 'Limited'
}
export const selector_isDefaultLoggedOutUserEnabled = (state) => {
  return !selector_ipsUserLogo(state) &&
  window.flags &&
  window.flags[DEFAULT_LOGGED_OUT_FEATURE_FLAG] 
}
/* there is one selector defined in cart, which we want to avoid as old cart is replaced with new cart that
 *  wont be available
 * */
export function selector_isSharedUser(state) {
  const userInformation = selector_userInformation(state)
  return get(userInformation, ['UserType'], 'Standard') === 'Shared'
}
export function selector_webLoginProfileId(state) {
  const userInformation = selector_userInformation(state)
  return get(userInformation, ['webLoginProfileId'], 0)
}
export const selector_showProductImages = (state) =>
  selector_userInformation(state).showProductImages || false
export const selector_isB2BUser = (state) =>
  get(selector_user(state), ['b2bLoginInfo', 'isB2BUser'], false)
export const selector_freightTax = (state) =>
  get(selector_user(state), ['b2bLoginInfo', 'freightTax'], false)

export const selector_isLoggedIn = (state) =>
  selector_user(state).isLoggedIn || false
export const selector_isSEWPUser = (state) =>
  selector_user(state).isSEWPUser || false
// setting [] as default value, to handle null scenarios
export const selector_userPermissions = (state) =>
  get(selector_user(state), 'userPermissions', []) || []
export const selector_webGroupPermissions = (state) =>
  get(selector_user(state), 'webGroupPermissions', []) || []
export const selector_webLoginProfile = (state) =>
  get(selector_user(state), 'webLoginProfile', '')
export const selector_userRequestorGroups = (state) =>
  selector_user(state).requestorGroups || null

export const selector_numberOfRequestorGroups = (state) =>
  selector_userRequestorGroups(state)
    ? selector_userRequestorGroups(state).requestorGroups.length
    : null
export const selector_userHasOneRequestorGroup = (state) =>
  selector_numberOfRequestorGroups(state) === 1
export const selector_onlyRequestorGroup = (state) =>
  selector_userHasOneRequestorGroup(state)
    ? selector_userRequestorGroups(state).requestorGroups[0]
    : null

export const selector_hasPermission = (state, permission) =>
  selector_userPermissions(state).includes(permission) ||
  selector_webGroupPermissions(state).includes(permission)
export const selector_hasUserPermission = (state, permission) =>
  selector_userPermissions(state).includes(permission)
export const selector_hasWebGroupPermission = (state, permission) =>
  selector_webGroupPermissions(state).includes(permission)

export const selector_userHomePageURL = (state) =>
  !selector_isLoggedIn(state) && selector_isSEWPUser(state)
    ? '/sewp'
    : '/insightweb/welcome'

/**
 * Permission Selectors
 */
export const selector_hasBuyPermission = (state) =>
  selector_hasUserPermission(state, userPermissions.BUY)
export const selector_hasQuickShopPermission = (state) =>
  selector_hasUserPermission(state, userPermissions.QUICK_SHOP)
export const selector_userRequiresApproval = (state) =>
  selector_hasUserPermission(state, userPermissions.USER_REQUIRES_APPROVAL)
export const selector_hasEmptyShippingPermission = (state) =>
  selector_hasUserPermission(state, userPermissions.EMPTY_SHIPPING)
export const selector_hasEmptyBillingPermission = (state) =>
  selector_hasUserPermission(state, userPermissions.EMPTY_BILLING)
export const selector_hasSoftwareContractSearchPermission = (state) =>
  selector_hasUserPermission(state, userPermissions.ENABLE_SW_CONTRACT_SEARCH)
export const selector_hasQuickFormsPermission = (state) =>
  selector_hasUserPermission(state, userPermissions.QUICK_FORMS)
export const selector_hasQuickCheckoutPermission = (state) =>
  selector_hasUserPermission(state, userPermissions.ENABLE_QUICK_CHECKOUT)
export const selector_hasForceCarrierAccountPermission = (state) =>
  selector_hasUserPermission(state, userPermissions.FORCE_CARRIER_ACCOUNT)
export const selector_hasEditCheckoutDefaultsFavoritesPermission = (state) =>
  selector_hasUserPermission(state, userPermissions.EDIT_CHKOUT_DEFAULT_FAVS)
export const selector_hasUserPreferences = (state) =>
  selector_hasUserPermission(state, userPermissions.ENABLE_USER_PREFERENCES)
export const selector_hasSuppressShippingEstimateInCart = (state) =>
  selector_hasWebGroupPermission(
    state,
    webGroupPermissions.SUPPRESS_SHIPPING_ESTIMATE_IN_CART
  )
export const selector_hasStockAndPriceDisplayDisabled = (state) =>
  selector_hasWebGroupPermission(
    state,
    webGroupPermissions.DISABLE_STOCK_AND_PRICE_DISPLAY
  )
