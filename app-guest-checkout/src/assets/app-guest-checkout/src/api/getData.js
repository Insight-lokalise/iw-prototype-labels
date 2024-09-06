import axios, {GET} from './axiosConfig'
import {getUserInformation} from 'app-api-user-service'

let cachedUserInfoResponse

export function getAccountInformation() {
  if (!cachedUserInfoResponse) {
    cachedUserInfoResponse = getUserInformation().then(({ data }) => {
      return {
        isLoggedIn: data?.isLoggedIn || false,
        sessionId: data?.sessionId || '',
        locale: data?.locale || 'en_US',
        account: (data.isLoggedIn && data.userInformation.account) || null,
        webGroupId: data?.userInformation?.webGroup?.webGroupId || '',
        salesOrg: data?.userInformation?.salesOrg || '',
        soldto: data?.userInformation?.account?.soldToId || '',
        reportingParentId: data?.userInformation?.reportingParentId || '',
        webLoginProfileId: data?.userInformation?.webLoginProfileId || '',
        ipsUser: data?.userInformation?.isIpsUser || false,
        isCES: data?.userInformation?.isCES || false,
        currencyCode: data?.userInformation?.currencyCode || 'USD',
        isIntegration: data?.rrApiUrl?.includes('integration') || false,
        permissions: data?.userInformation?.permissions || {},
      }
    })
  }
  return cachedUserInfoResponse
}

export function getUser() {
  return axios({
    method: GET,
    url: `insightweb/getUserInformation`,
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to get session user info `, error)
    })
}

let cachedUserResponse

export function getUserData() {
  if (!cachedUserResponse) {
    cachedUserResponse = getUser().then(( data ) => {
      return {
        isLoggedIn: data?.isLoggedIn || false,
        defaultHomePage: data?.defaultHomePage,
        userInformation: data?.userInformation || null,
        userPermissions: data?.userPermissions || [],
        webGroupPermissions: data?.webGroupPermissions || [],
      }
    })
  }
  return cachedUserResponse
}


export function fetchShoppingRequest() {
  return axios({
    method: GET,
    url: `insightweb/shoppingrequest?reload=true`,
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to fetch shopping request`, error)
    })
}

export function fetchUIFlags() {
  const timestamp = new Date().getTime()
  return axios({
    method: GET,
    url: `insightweb/populateUIFlags?_=${timestamp}`,
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to fetch UI Flags`, error)
    })
}

export function proceedToCheckout({ source, quickCheckout }) {
  const timestamp = new Date().getTime()
  const quickCheckoutURL =
    quickCheckout !== null ? `&quickCheckoutRequested=${quickCheckout}` : ''
  const sourceURL = source !== null ? `&source=${source}` : ''
  return axios({
    method: GET,
    url: `insightweb/checkout?_=${timestamp}${quickCheckoutURL}${sourceURL}`,
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to get URL`, error)
    })
}

export function checkIfExistingUser(email) {
  return axios({
    method: GET,
    url: `gapi/checkout/checkEmail?email=${email}`,
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to identify if existing user`, error)
    })
}

export function getStatesByCountry(country) {
  return axios({
    method: GET,
    url: `insightweb/transaction/getStatesByLocale/${country}`,
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
    url: 'insightweb/getCountries',
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to get list of countries`, error)
    })
}

export const getEnrollmentIDs = async ({ soldto, reportingParentId }) => {
  const reqObj = {
    soldTo: soldto,
    rp: reportingParentId,
    includeDescription: false,
  }
  const response = await axios({
    method: GET,
    url: `gapi/cart/enrolledPartners?soldTo=${soldto}&rp=${reportingParentId}&includeDescription=false`,
  })
  return response?.data
}

export const fetchTaxAndEWRFee = async (shoppingRequest) => {
  return await axios.post(`insightweb/guestCheckout/taxAndEWRFee`, shoppingRequest);
}

export const persistCartSummary = async (shoppingRequest) => {
  return await axios.post(`gapi/checkout/shoppingrequest/cart/summary`, shoppingRequest);
}

export function prepareUIShoppingCart() {
  return axios
      .get('/insightweb/sessionCartToShoppingRequest')
      .catch(error => {
        console.warn('Failed to derive UI shopping request from session shopping request', error)
        throw error
      })
      .then(({data}) => data)
}
