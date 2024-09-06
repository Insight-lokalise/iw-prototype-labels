import { getUserInformation } from 'app-api-user-service'

let cachedResponse

const SITE_CODE_RWM = 27
const SITE_CODE_ELD = 8

const excludedSites = [
  SITE_CODE_RWM, // Renewals and Warranty Manager
  SITE_CODE_ELD // Enterprise License Dashboard
]

/**
 * Fetch the header/user information, with hard-coded favorites links.
 */
export default function getHeaderInformation() {
  if (!cachedResponse) {
    cachedResponse = getUserInformation().then(({ data }) => {
      const locale = data.locale || 'en_GB'
      const country = locale.split('_')[1]
      const isCreateAccountDisabled = ['DK','IE', 'NO', 'SE', 'UE'].includes(country)
      const isUSEnrollments = country === 'UE'

      const result = {
        customContactNumber: data.insightPhoneNumber,
        isAccountToolsEnabled: false,
        isCreateAccountEnabled: !isCreateAccountDisabled,
        isLimitedBuyer: false,
        isLiveChatEnabled: false,
        isLoggedIn: false,
        isNotificationsEnabled: false,
        isPhoneNumberEnabled: !isUSEnrollments,
        isSEWPUser: false,
        isIPSUser: false,
        locale,
        region: 'emea',
        userInformation: {
          permissions: {
            enableSearch: true,
            enableSearchSuggestions: true,
          },
        },
      }

      if (data.userInformation) {
        result.userInformation = processUserInformation(data.userInformation)
        result.isLoggedIn = true
        result.isLiveChatEnabled = result.userInformation.permissions.enableLiveChat
        result.isLogoutEnabled = !result.userInformation.isInternalUser
        result.isPhoneNumberEnabled = result.isPhoneNumberEnabled && !result.isLiveChatEnabled
      }

      return result
    })
  }

  return cachedResponse
}

/**
 * Process the user information, adding hard-coded permissions and favorite
 * links, as these are not yet implemented for EMEA. Also, translate the
 * account object to something understandable by the account bar.
 */
function processUserInformation(user) {
  const userPermissions = user.permissions
  const isMyInsightUser = user.webGroup && user.webGroup.name !== null
  const companyPermissions = (user.webGroup && user.webGroup.companyUiOptions) || {}
  const result = { ...user }

  // Hard-coded permissions, until the user service changes have been made.
  result.permissions = {
    enableConfigurators: !userPermissions.DISABLE_CONFIGURATORS,
    enableCountrySelect: !userPermissions.DISABLE_COUNTRY_SELECT && !companyPermissions.hide_locale_selector,
    enableCustomerSupport: !userPermissions.DISABLE_CUST_SUPPORT,
    enableFavorites: false,
    enableInvoiceHistoryLink: !userPermissions.DISABLE_INVOICE_REPORTING,
    enableLiveChat: companyPermissions.enable_livechat,
    enableLogout: !user.isInternalUser,
    enableManageCloudPortalLink: !companyPermissions.hide_cloud_management,
    enableMyAccount: !companyPermissions.hide_my_insight_user_menu_myAccount,
    enableMyInsightLinks: isMyInsightUser,
    enableMyInsightLogoLink: userPermissions.RESTRICT_LOGO_LINK,
    enableMyProductsLink: isMyInsightUser,
    enableNotifications: false,
    enableOrderHistory: !userPermissions.DISABLE_ORDER_REPORTING,
    enableOrderTemplatesLink: isMyInsightUser && !userPermissions.DISABLE_ORDER_TEMPLATES,
    enablePurchaseRequestsLink: userPermissions.PURCHASE_AUTHORIZATION || userPermissions.PURCHASE_AUTHORIZER,
    enableQuoteHistoryLink: !userPermissions.DISABLE_QUOTE_REPORTING,
    enableSearch: !userPermissions.DISABLE_SEARCH,
    enableSearchSuggestions: true,
    enableToolsLinks: !userPermissions.DISABLE_TOP_LINKS,
  }

  result.account = result.account || {}
  result.account.displayId = result.account.id
  result.account.id = result.account.contactId = window.appUserService ? window.appUserService.contactId : ''
  result.account.name = `${result.account.customerName} - ${result.account.contactName}`

  // Is this user a B2B user?
  result.b2bInfo = {
    isB2B: user.b2b && user.b2b.b2bUser,
  }

  // For non-MyInsight users, web group will need to be cleared out.
  if (result.webGroup && result.webGroup.id === 0) {
    result.webGroup = null
  }

  // If the user is not allowed to change their billing address (account), then
  // mark is as locked so that the AccountSelector knows to lock the dropdown.
  if (result.account && userPermissions.DISABLE_BILLING_ADDR_CHANGE) {
    result.account.isLocked = true
  }

  // The name of the account is the contact name.
  if (result.account) {
    result.account.name = `${result.account.customerName} - ${result.account.contactName}`
  }

  // Map 'sites' to 'availableSites'.
  // Filter out sites we don't want to show
  // And sort them rather than having appear in a random order!
  result.availableSites = result.sites.filter(site => {
    return !excludedSites.includes(site.id)
  }).sort((site1, site2) => {
    return site1.name.localeCompare(site2.name)
  })

  // Pluck the custom company standards title out of the company info.
  result.companyStandardsTitle = result.webGroup && result.webGroup.myProductsTitle

  return result
}
