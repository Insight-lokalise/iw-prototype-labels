import getInObject from '@insight/toolkit-utils/lib/helpers/getInObject'
import { getUserInformation, getAllFeatureFlags } from 'app-api-user-service'
import axios, { GET } from './axiosConfig'

let contactInfoCache // Cache response to avoid duplicate calls
export function fetchPersonalInformation(clearCache) {
  if (!contactInfoCache || !!clearCache) {
    const timestamp = new Date().getTime()
    contactInfoCache = axios({
      method: GET,
      url: `/endUser/getContactInfo/${timestamp}`,
    })
  }

  return contactInfoCache
    .then(({ data }) => {
      const {
        user: {
          email,
          firstName,
          lastName,
          phoneNumber,
          soldToNumber,
          defaultSoldToId,
          emailQuotes,
          orderQuotes,
          userPreferences: { email_format },
          login,
        },
      } = data
      return {
        email,
        firstName,
        lastName,
        phoneNumber,
        accountNumber: soldToNumber || defaultSoldToId,
        emailQuotes,
        orderQuotes,
        emailFormat: email_format,
        login,
      }
    })
    .catch((error) => {
      console.warn(`Failed to fetch personal information`, error)
    })
}

export function fetchLoginInformation() {
  const timestamp = new Date().getTime()
  return axios({
    method: GET,
    url: `/endUser/getLoginInfo/${timestamp}`,
  })
    .then(({ data }) => {
      const { userName } = data
      return { userName, password: '*********' }
    })
    .catch((error) => {
      console.warn(`Failed to fetch Login information`, error)
    })
}

let checkoutDefaultsCache // Cache response to avoid duplicate calls
export function fetchCheckOutDefaults(clearCache) {
  if (!checkoutDefaultsCache || !!clearCache) {
    const timestamp = new Date().getTime()
    checkoutDefaultsCache = axios({
      method: GET,
      url: `/endUser/getCheckOutDefaults/${timestamp}`,
    })
  }

  return checkoutDefaultsCache
    .then(({ data }) => {
      const {
        defaultShipingAndBillingAddress: {
          defaultBillingAddress,
          defaultShippingAddress,
        },
        payOptions: {
          allowedOptions: allowedPaymentMethods,
          defaultOption: defaultPaymentMethod,
        },
      } = data
      return {
        defaultBillingAddress,
        defaultShippingAddress,
        allowedPaymentMethods,
        defaultPaymentMethod,
      }
    })
    .catch((error) => {
      console.warn(
        `Failed to fetch default shipping and billing addresses`,
        error
      )
    })
}

export function checkUserNameAvailability(domain, userName) {
  return axios({
    method: GET,
    url: `/createUser/checkLoginAvailability/${userName}/${domain}`,
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to check user name availability`, error)
    })
}
export function fetchAddresses(addressSearchParam) {
  const addressRequestPayload = {
    startPage: 1,
    recordsPerPage: 0 /* set to zero so we can return all records instead of pagination */,
    webGroupId: 0,
    loginProfileId: 0,
    shipIndicator: true /* true - Shipping , false - Billing */,
    shipToBillToSearch: {
      shipToBillToSearchType: 'All',
      searchText: null,
    },
  }

  return axios({
    method: 'post',
    url: `/transaction/getShippingBillingAddresses`,
    data: Object.assign({}, addressRequestPayload, addressSearchParam),
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to fetch addresses`, error)
      throw error
    })
}

export function getStatesByCountry(country) {
  return axios({
    method: GET,
    url: `/transaction/getStatesByLocale/${country}`,
  })
    .then(({ data }) =>
      country === 'CA' ? data.filter((state) => state.key !== 'ZZ') : data
    )
    .catch((error) => {
      console.warn(`Failed to get states`, error)
    })
}

export function getCountries() {
  return axios({
    method: GET,
    url: '/getCountries',
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to get list of countries`, error)
    })
}

export function getTokenizedCard(token) {
  return axios({
    method: GET,
    url: `/paymetrics-token?accessCode=${token}`,
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to get tokenized card`, error)
    })
}

export function getAuthTokenizedCard(pmRequest) {
  return axios({
    method: 'post',
    url: 'paymetrics-3ds-token',
    data: pmRequest,
    headers: { 'Content-Type': 'application/json' },
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn('Failed to fetch 3DS2 paymetrics token')
      throw error
    })
}

let storedCardCache
export function getStoredCards(clearCache) {
  if (!storedCardCache || !!clearCache) {
    storedCardCache = axios({ method: GET, url: '/transaction/storedCards' })
  }
  return storedCardCache
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to fetch stored cards`, error)
    })
}

export function fetchPayMetricsFrame(pmRequest) {
  return axios({
    method: 'post',
    url: 'paymetrics-iFrame',
    data: pmRequest,
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => {
    console.warn(`Failed to fetch pay metric iframe`, error)
    throw error
  })
}

export function fetchPayMetrics3DSFrame(pmRequest) {
  return axios({
    method: 'post',
    url: 'paymetrics-3ds-iFrame',
    data: pmRequest,
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.data)
    .catch((error) => {
      console.warn(`Failed to fetch pay metric iframe`, error)
      throw error
    })
}

let cachedUserInfoResponse
export function getAccountInformation() {
  if (!cachedUserInfoResponse) {
    cachedUserInfoResponse = getUserInformation().then(({ data }) => ({
      displayDashboard: getInObject(
        data,
        ['userInformation', 'displayDashboard'],
        false
      ),
      isLoginAs:
        data.isLoggedIn &&
        getInObject(data, ['userInformation', 'isLoginAs'], false),
      isRequestor:
        data.isLoggedIn &&
        getInObject(
          data,
          ['userInformation', 'permissions', 'userRequiresApproval'],
          false
        ),
      enableCyberSource:
        data.isLoggedIn &&
        getInObject(data, ['userInformation', 'enableCyberSource'], false),
      currencyCode:
        data.isLoggedIn &&
        getInObject(data, ['userInformation', 'currencyCode'], 'USD'),
      salesOrg:
        data.isLoggedIn &&
        getInObject(data, ['userInformation', 'salesOrg'], '2400'),
      pingDomain: data.pingDomain,
      pingClientId: data.pingClientId,
    }))
  }
  return cachedUserInfoResponse
}

let getAllAccountsCachedResponse
export function getAllAccounts(payload, flushCache = false) {
  if (!getAllAccountsCachedResponse || flushCache) {
    getAllAccountsCachedResponse = axios
      .post('/endUser/getCurrentAccount', payload)
      .catch((error) => {
        console.warn('Failed to fetch all accounts data', error)
        throw error
      })
      .then(({ data }) => data)
  }

  return getAllAccountsCachedResponse
}

let featureFlagsCachedResponse
export function getFeatureFlags() {
  if (!featureFlagsCachedResponse) {
    featureFlagsCachedResponse = getAllFeatureFlags().then(({ data }) => {
      return data
    })
  }

  return featureFlagsCachedResponse
}

export function getCIAMFeatureFlag() {
  return (
    window.flags && window.flags['GNA-12439-CIAM-MIGRATION-PING-ONE-IDENTITY']
  )
}
