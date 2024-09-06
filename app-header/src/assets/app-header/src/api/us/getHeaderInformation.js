import { getUserInformation } from 'app-api-user-service'

let cachedResponse

export default function getHeaderInformation() {
  if (!cachedResponse) {
    cachedResponse = getUserInformation().then(({ data }) => {
      const result = {
        ...data,
        isAccountToolsEnabled: true,
        isCreateAccountEnabled: !data.isLoggedIn,
        isLimitedBuyer:
          data.isLoggedIn &&
          Object.keys(data.userInformation.account).length === 0,
        isLiveChatEnabled:
          !data.isLoggedIn ||
          (data.isLoggedIn &&
            data.userInformation.permissions.enableLiveChat &&
            !data.userInformation.isLoginAs),
        isPhoneNumberEnabled: true,
        region: 'us',
        userInformation: processUserInformation(data.userInformation),
        isIPSUser:
          (data.isLoggedIn && data.userInformation.isIpsUser) || data.isIpsLogo,
        isSEWPUser: data.isSEWPUser,
        isCES: data.isLoggedIn && data.userInformation.isCES,
        currencyCode: data.isLoggedIn ? data.userInformation.currencyCode : '',
      }
      updateTokenInSession(data.jwtToken, data.isLoggedIn)
      return result
    })
  }

  return cachedResponse
}

/**
 * Process the user information object into an API-agnostic one.
 */
function processUserInformation(userInformation) {
  if (!userInformation) {
    return {
      availableSites: [],
      b2bInfo: { isB2B: false },
      permissions: { enableSearch: true, enableSearchSuggestions: true },
    }
  }

  const result = { ...userInformation }

  result.b2bInfo = {
    ...result.b2bInfo,
    isITS: result.b2bInfo.customMastheadFooter === 'ITS',
  }

  // Map 'login' to 'username'.
  result.username = result.login

  result.permissions = {
    ...result.permissions,
    enableLogout: true,
    enableNotifications: true,
  }

  // Coalesce the web group to either null, or an object.
  if (result.webGroup && result.webGroup.webGroupId) {
    result.webGroup = {
      id: result.webGroup.webGroupId,
      name: result.webGroup.name,
      countryCode: result.webGroup.countryCode,
    }
  } else {
    result.webGroup = null
  }

  // Coalesce the account to either null, or an object.
  result.account = {
    id: result.account.soldToId,
    name: result.account.name,
  }

  // Process the list of available sites, modifying the object keys.
  if (result.availableSites) {
    result.availableSites = result.availableSites.map((site) => ({
      display: site.display,
      id: site.webSiteId,
      name: site.name,
      nav: site.nav,
    }))
  }

  return result
}

/**
 * Set / unset jwt token from session storage on header app load
 */
function updateTokenInSession(token, isLoggedIn) {
  if (isLoggedIn) {
    sessionStorage.setItem('access_token', token)
  } else {
    // remove token from session storage
    sessionStorage.removeItem('access_token')
  }
}
