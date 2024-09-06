import { getContracts } from 'app-api-user-service'

import { CONTRACT_ALL, CONTRACT_OPEN_MARKET } from './constants'

export function getContractResults(searchTerm) {
  return getContracts().then(({ data }) => {
    const { contracts, openMarket } = data

    const mappedContracts = contracts.map(({ abbreviation, contractID, longDescription }) => ({
      displayName: abbreviation,
      id: contractID,
      name: abbreviation,
      longDescription,
    }))

    const defaultContracts = openMarket ? [CONTRACT_ALL, CONTRACT_OPEN_MARKET] : [CONTRACT_ALL]
    const allResults = mappedContracts.length > 0 ? [...defaultContracts, ...mappedContracts] : mappedContracts

    let filteredResults = allResults
    if (searchTerm) {
      const regex = RegExp(searchTerm.toUpperCase())
      filteredResults = allResults.filter(result => regex.test(result.displayName.toUpperCase()))
    }

    return {
      results: filteredResults,
      totalResults: allResults.length,
    }
  })
}
