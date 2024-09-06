import axios from 'axios'

export default function getSearchSuggestions(searchTerm) {
  return axios
    .post(`${window.siteHrefCurrentBase}/apps/seotools/results.php`, { searchTerm })
    .catch(error => {
      console.warn('Failed to fetch search suggestions', error)
      throw error
    })
    .then(({ data }) => ({ results: data.searchSuggestions || [] }))
}
