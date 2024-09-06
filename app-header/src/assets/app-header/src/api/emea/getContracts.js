import { getHeaderInformation } from 'api'

/**
 * Fetch the contracts of header/user information.
 */

export default function getContracts(searchTerm) {
  return getHeaderInformation().then(data => {
    const allResults = data.userInformation.contracts
    let filteredResults = allResults

    if (searchTerm) {
      const regex = RegExp(searchTerm.toUpperCase())
      filteredResults = allResults.filter(result => regex.test(result.name.toUpperCase()))
    }

    filteredResults = filteredResults.map(result => ({
      ...result,
      accountNumber: data.userInformation.accountNumber,
      contactId: window.appUserService.contactId,
      displayName: result.name,
      username: data.userInformation.username,
    }))
    return {
      results: filteredResults,
      totalResults: allResults.length,
    }
  })
}
