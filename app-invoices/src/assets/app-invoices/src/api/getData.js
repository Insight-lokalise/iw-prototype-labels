import { getUserInformation } from 'app-api-user-service'
import axios, { GET, POST } from './axiosConfig'

let cachedUserInfoResponse

export function getAccountInformation() {
  if (!cachedUserInfoResponse) {
    cachedUserInfoResponse = getUserInformation().then(({ data }) => {
      return {
        account: (data.isLoggedIn && data.userInformation.account) || null,
        webGroupId: data.userInformation?.webGroup?.webGroupId || null,
        salesOrg: data.userInformation?.salesOrg || null,
        locale: data.locale || null,
      }
    })
  }
  return cachedUserInfoResponse
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

export async function getInvoiceDetails({ id }) {
  const { account, webGroupId, salesOrg, locale } =
    await getAccountInformation()

  return axios({
    method: GET,
    url: `/api/reporting/invoice/${id}`,
    params: {
      soldto: account.soldToId || null,
      wgId: webGroupId,
      locale,
      salesorg: salesOrg,
    },
  })
    .then(({ data }) => data)
    .catch((error) => {
      if (!error.response.status || error.response.status === 404) {
        window.location.href = '/insightweb/404'
      }
      console.warn(`Failed to fetch Invoice details`, error)
      throw error
    })
}

export async function getInvoiceHistory(req) {
  const { webGroupId, salesOrg, locale } = await getAccountInformation()
  const { soldto } = req

  return axios({
    method: POST,
    url: `/api/reporting/invoice`,
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
      const { pagination, invoices } = data
      return {
        pagination,
        invoices: processInvoice(invoices),
      }
    })
    .catch((error) => {
      console.warn(`Failed to fetch invoices`, error)
      throw error
    })
}
function processInvoice(invoices) {
  return invoices.reduce((acc, invoice) => {
    const {
      header: {
        accountName,
        accountNumber,
        createdOn: date,
        invoiceNumber: number,
        invoiceStatus: status,
        poRelease,
        po,
        orderNumber,
        currency
      },
      shoppingRequest: {
        cart: {
          cartItems: products,
          summary: { totalCost: total },
        },
      },
    } = invoice

    return acc.concat([
      {
        accountName,
        accountNumber,
        date,
        status,
        number,
        poRelease,
        po,
        orderNumber,
        products,
        total,
        currency
      },
    ])
  }, [])
}
