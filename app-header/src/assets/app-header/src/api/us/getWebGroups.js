import axios from 'axios'

let cachedResponse

export default function getWebGroups(searchTerm) {
  if (!cachedResponse) {
    const timestamp = new Date().getTime()
    cachedResponse = axios.get(`/insightweb/endUser/getwebGroupDetails/${timestamp}`).catch(error => {
      console.warn('Failed to fetch web group data', error)
      throw error
    })
  }

  return cachedResponse.then(({ data }) => {
    const { webGroups, webloginProflieId: webloginProfileId } = data
    const allResults = webGroups
      .map(webGroup => ({
        cssCountryFlag: webGroup.csscountryflag,
        ...webGroup,
        displayName: webGroup.name,
        webloginProfileId,
      }))
      .sort(sortWebGroupsByName)

    let filteredResults = allResults
    if (searchTerm) {
      const regex = RegExp(searchTerm.toUpperCase())
      filteredResults = allResults.filter(result => regex.test(result.name.toUpperCase()))
    }

    return {
      results: filteredResults,
      totalResults: allResults.length,
    }
  })
}

function sortWebGroupsByName(a, b) {
  const nameA = a.name.toUpperCase()
  const nameB = b.name.toUpperCase()
  if (nameA < nameB) {
    return -1
  } else if (nameA > nameB) {
    return 1
  }
  return 0
}
