import axios from 'axios'
import getHeaderInformation from './getHeaderInformation'

let cachedResponse

/**
 * Returns a promise of a list of accounts that match the given search term, or
 * all accounts if no search term is provided.
 */
export default function getAccounts(searchTerm) {
  return searchTerm === '' ? getAllAccounts() : searchAccounts(searchTerm)
}

/**
 * Returns a (cached) promise of all account.
 */
function getAllAccounts() {
  if (!cachedResponse) {
    cachedResponse = getHeaderInformation().then(({userInformation}) => {
      if (!userInformation.isInternalUser) {
        return fetchAllAccounts().then(({data}) => {
          const totalResults = data && data.count ? data.count : 1
          // eslint-disable-next-line no-underscore-dangle
          const accounts = (data && data._embedded.WebUser) || []
          const currentAccountId = userInformation.account.contactId
          const results = accounts.reduce(createAccountsReducer(currentAccountId), [])
          return { results, totalResults }
        })
      } else {
        return { results: [], totalResults: 0 }
      }
    })
  }

  return cachedResponse;
}

/**
 * Returns a promise of all accounts that match the provided search term.
 */
function searchAccounts(searchTerm) {
  return getAllAccounts().then(({ results, totalResults }) => {
    const words = searchTerm.trim().split(/\s+/)

    let filteredResults = results
    words.forEach(word => {
      filteredResults = filteredResults.filter(result => (
        result.searchText.toUpperCase().indexOf(word.toUpperCase()) !== -1
      ))
    })

    return {
      results: filteredResults,
      totalResults
    }
  })
}

/**
 * Fetch a list of all accounts for the currently logged in user.
 */
function fetchAllAccounts() {
  const accountConfig = window.appGetAccountInfoByUserConfig || {};
  let response

  if (accountConfig.authToken) {
    response = axios
      .get(`${window.siteServiceBase}/Account/v1/GetAccountInfoByUser`,
        {
          params: {WebUserName: accountConfig.webUserName, InsightEntity: window.siteEntity},
          headers: {
            Authorization: accountConfig.authToken,
            Accepts: 'application/json',
          }
        })
      .catch(error => {
        console.warn('Failed to fetch account data', error)
        throw error
      })
  } else {
    response = Promise.resolve({
      results: [],
      totalResults: 1,
    })
  }

  return response
}

/**
 * Construct a new reducer function that will return a list of unique accounts,
 * mapped to a data structure that the components will recognise.
 */
function createAccountsReducer(currentAccountId) {
  const ids = []

  return (accounts, account) => {
    const mappedAccount = mapAccount(account)

    if (ids.indexOf(mappedAccount.id) === -1) {
      ids.push(mappedAccount.id)
      accounts.push({
        ...mappedAccount,
        isActive: mappedAccount.id === currentAccountId,
      })
    }

    return accounts
  }
}

/**
 * Map an account to a standard data structure that the components understand.
 */
function mapAccount(account) {
  return {
    id: account.CustByUser.CustomerByUser.ContactId,
    accountNumber: account.CustByUser.CustomerByUser.AccountMessage.Account.AccountNo,
    webUserName: account.WebUserName,
    displayName: `${account.CustByUser.CustomerByUser.AccountMessage.Account.AccountNo} `
      + `${account.CustByUser.CustomerByUser.AccountMessage.Account.AccountTradingName}`
      + ` - ${account.CustByUser.CustomerByUser.Firstname} ${account.CustByUser.CustomerByUser.Lastname}`,
    searchText: `${account.CustByUser.CustomerByUser.AccountMessage.Account.AccountNo} `
      + `${account.CustByUser.CustomerByUser.Firstname} `
      + `${account.CustByUser.CustomerByUser.Lastname} `
      + `${account.CustByUser.CustomerByUser.AccountMessage.Account.AccountTradingName} `
      + `${account.CustByUser.CustomerByUser.AccountMessage.Account.AttentionTo} `
      + `${account.CustByUser.CustomerByUser.AccountMessage.Account.CompanyName} `
      + `${account.CustByUser.CustomerByUser.AccountMessage.Account.AddrLine1} `
      + `${account.CustByUser.CustomerByUser.AccountMessage.Account.AddrLine2} `
      + `${account.CustByUser.CustomerByUser.AccountMessage.Account.Street} `
      + `${account.CustByUser.CustomerByUser.AccountMessage.Account.City} `
      + `${account.CustByUser.CustomerByUser.AccountMessage.Account.ZipCode}`,
  }
}
