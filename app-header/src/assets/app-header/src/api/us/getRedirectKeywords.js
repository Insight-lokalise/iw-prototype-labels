import { v4 as uuid } from 'uuid';

export default function getRedirectKeywords() {
  return window.InsightApplicationDataObject.ready().then(data => normalizeRedirectKeywords(data.RedirectKeywords))
}

function normalizeRedirectKeywords(chaos) {
  const startingObject = {
    redirectURLs: {},
    keywords: {},
  }

  return Object.keys(chaos).reduce((acc, curr) => {
    const correspondingObject = chaos[curr]
    const redirectURLGUID = uuid()
    const keywordsList = curr.split(';').map(val => val.trim())

    // add redirect url to acc
    acc.redirectURLs[redirectURLGUID] = correspondingObject.redirectUrl

    // add keywords to acc
    keywordsList.forEach(keyword => {
      acc.keywords[keyword] = redirectURLGUID
    })

    return acc
  }, startingObject)
}

// const mockData = {
//   'careers;career': { redirectUrl: 'https://jobs.insight.com/' },
//   'absolute data and device security;absolute data and device security;absolute;absolute;computrace;computrace': {
//     redirectUrl: '/content/insight-web/en_US/buy/partner/absolute-software.html',
//   },
//   'meraki; meraki; cisco meraki; cisco meraki': {
//     redirectUrl:
//       '/content/insight-web/en_US/search.html?qtype=all&q=cisco%20meraki&pq=%7B%22pageSize%22%3A10%2C%22currentPage%22%3A1%2C%22shownFlag%22%3Atrue%2C%22priceRangeLower%22%3A0%2C%22priceRangeUpper%22%3A0%2C%22cmtStandards%22%3Atrue%2C%22categoryId%22%3Anull%2C%22setType%22%3Anull%2C%22setId%22%3Anull%2C%22shared%22%3Anull%2C%22groupId%22%3Anull%2C%22cmtCustomerNumber%22%3Anull%2C%22groupName%22%3Anull%2C%22fromLicense%22%3Atrue%2C%22licenseContractIds%22%3Anull%2C%22programIds%22%3Anull%2C%22controller%22%3Anull%2C%22fromcs%22%3Afalse%2C%22searchTerms%22%3A%7B%22%2522cisco%2520meraki%2522%22%3A%7B%22field%22%3A%22searchTerm%22%2C%22value%22%3A%22cisco%20meraki%22%7D%7D%7D',
//   },
// }
