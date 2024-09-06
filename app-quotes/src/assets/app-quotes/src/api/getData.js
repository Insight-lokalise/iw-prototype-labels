import { getUserInformation } from 'app-api-user-service'
import axios, { GET, POST } from './axiosConfig'

export const ADDRESS_RECORDS_PER_PAGE = 3

export function fetchAddresses(addressSearchParam) {
  const addressRequestPayload = {
    startPage: 1,
    recordsPerPage: ADDRESS_RECORDS_PER_PAGE,
    webGroupId: 0,
    loginProfileId: 0,
    shipIndicator: true /* true - Shipping , false - Billing */,
    shipToBillToSearch: {
      shipToBillToSearchType: 'All',
      searchText: null,
    },
  }

  return axios({
    method: POST,
    url: `insightweb/transaction/getShippingBillingAddresses`,
    data: Object.assign({}, addressRequestPayload, addressSearchParam),
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to fetch addresses`, error)
      throw error
    })
}

export function fetchProductInformation({ locale, materialId }) {
  return axios({
    method: GET,
    url: `insightweb/cs/endUser/productInformation`,
    params: { locale, matId: materialId },
  }).catch((error) => {
    console.warn(`Failed to fetch PDP information`, error)
    throw error
  })
}

export async function getQuoteDetails({ id }) {
  const { account, webGroupId, locale, salesOrg } =
    await getAccountInformation()

  return axios({
    method: GET,
    url: `api/reporting/quote/${id}`,
    params: {
      soldto: account.soldToId || null,
      wgId: webGroupId,
      locale,
      salesorg: salesOrg,
    },
  })
    .then(({ data }) => data.quoteDetails)
    .catch((error) => {
      if (error.response.status === 404) {
        window.location.href = '/insightweb/404'
      }
      console.warn(`Failed to fetch Quote details`, error)
      throw error
    })
}

export async function getQuoteHistory(req) {
  const { webGroupId, locale, salesOrg } = await getAccountInformation()
  const { soldto } = req

  return axios({
    method: POST,
    url: `api/reporting/quote/quoteSearch`,
    data: {
      ...req,
      wgId: webGroupId,
      locale,
      salesorg: salesOrg,
    },
    params: {
      soldto,
      wgId: webGroupId,
    },
  })
    .then(({ data }) => {
      const { pagination, quotes } = data
      return {
        actualQuotes: quotes,
        pagination,
        quotes: processQuotes(quotes),
      }
    })
    .catch((error) => {
      console.warn(`Failed to fetch quotes`, error)
      throw error
    })
}

export function getTaxAndEWRFee() {
  return axios({
    method: POST,
    url: `/insightweb/taxAndEWRFee`,
    data: {},
  })
    .then((result) => result)
    .catch((error) => {
      console.warn(`Failed to fetch tax`, error)
      throw error
    })
}

export function saveFreightData(carrier) {
  return axios({
    method: POST,
    url: `insightweb/transaction/saveFreight`,
    data: {
      data: {
        carrierId: parseInt(carrier.carrierId),
        freight: Number(carrier.freight),
        shippingPartnerForViewCart: 0,
        sourcePageOfRequest: '',
      },
    },
  })
    .then((result) => result)
    .catch((error) => {
      console.warn(`Failed to fetch freight`, error)
      throw error
    })
}

export async function getTop5Quotes(req) {
  const { webGroupId, locale, salesOrg } = await getAccountInformation()
  const { soldto } = req

  return axios({
    method: POST,
    url: `api/reporting/quote/top5`,
    data: {
      ...req,
      wgId: webGroupId,
      salesorg: salesOrg,
      locale,
    },
    params: {
      soldto,
      wgId: webGroupId,
    },
  })
    .then(({ data }) => {
      const { pagination, quotes } = data
      return {
        pagination,
        quotes: processQuotes(quotes),
        actualQuotes: quotes,
      }
    })
    .catch((error) => {
      console.warn(`Failed to fetch top 5 quotes`, error)
      throw error
    })
}

let cachedUserInfoResponse
export function getAccountInformation() {
  if (!cachedUserInfoResponse) {
    cachedUserInfoResponse = getUserInformation().then(({ data }) => {
      return {
        account: (data.isLoggedIn && data.userInformation.account) || null,
        cdmUid: (data.isLoggedIn && data.userInformation.cdmUid) || null,
        isCES: (data.isLoggedIn && data.userInformation.isCES) || false,
        salesOrg: data.userInformation?.salesOrg || 2400,
        locale: data.locale || null,
        sessionId: data.sessionId,
        webGroupId: data.userInformation?.webGroup?.webGroupId || null,
      }
    })
  }
  return cachedUserInfoResponse
}

function processQuotes(quotes) {
  return quotes.reduce((acc, quote) => {
    const {
      header: {
        createdBy,
        createdOn: date,
        expires,
        quoteName: name,
        quoteNumber: number,
        currency,
        isConverted,
        opportunityId,
      },
      shoppingRequest: {
        cart: {
          cartItems: products,
          summary: { totalCost: total },
        },
      },
    } = quote

    return acc.concat([
      {
        createdBy,
        date,
        expires,
        name,
        number,
        products,
        total,
        currency,
        isConverted,
        opportunityId,
      },
    ])
  }, [])
}

export function getStatesByCountry(country) {
  return axios({
    method: GET,
    url: `/insightweb/transaction/getStatesByLocale/${country}`,
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
    url: '/insightweb/getCountries',
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.warn(`Failed to get list of countries`, error)
    })
}

export const fetchShippingCarriers = async () => {
  const timestamp = new Date().getTime()
  try {
    const { data } = await axios({
      method: GET,
      url: `/insightweb/shipBillPay/carriers?_=${timestamp}`,
    })
    return data
  } catch (err) {
    console.warn('Failed to get carriers', err)
    // TODO: Exclude nonshippable parts. Needed for non shippable parts
    return []
  }
}
