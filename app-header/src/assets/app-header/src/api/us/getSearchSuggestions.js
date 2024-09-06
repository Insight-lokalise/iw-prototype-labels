import axios from 'axios'
import getSearchURL from './getSearchURL'

// getting the suggestion related information from the web
let searchSuggestionsInformation
(function() {
  getSuggestionInformation().then(data => {
    searchSuggestionsInformation = data
  })
})()

export default function getSearchSuggestions(searchTerm) {
  return fetchSearchSuggestions(searchTerm).then((data) => ({
    results: modifySuggestionKeys(data.phraseSuggestions) || []
  }))
  function modifySuggestionKeys(inputData) {
    return inputData.map(({text, itemCategoryLabel}) => ({
      phrase: text,
      category: itemCategoryLabel,
      link: getSearchURL(text)
    }))
  }
}

export function fetchSearchSuggestions(searchTerm){
  const {pmvsSearchSuggestUrl, locale, salesOrg, phraseLimit, productLimit} = searchSuggestionsInformation
  const searchData = {
    enabledDebugMessages: true,
    filterByActive: true,
    filterByShowOnWeb: true,
    locale,
    salesOrg,
    phraseLimit,
    productLimit,
    phraseImageSizes: ['SMALL'],
    productImageSizes: ['SMALL'],
    searchText: searchTerm
  }

  return axios
    .post(pmvsSearchSuggestUrl, searchData, {
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
    .catch(error => {
      console.warn('Failed to fetch search suggestions', error)
      throw error
    })
    .then(({data}) => data)
}

function getSuggestionInformation() {
  const timestamp = new Date().getTime()
  return axios
    .get(`${'/insightweb/getSuggestionInformation'}?_=${timestamp}`)
    .catch(error => {
      console.warn('Failed to fetch suggestion information', error)
      throw error
    })
    .then(({data}) => data)
}
