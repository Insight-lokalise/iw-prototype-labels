import { getSearchURL } from './'

export default function navigateToSearchResults({ href, phrase = '', searchTerm = '' }) {
  window.location = href
    || getSearchURL(phrase.toLowerCase().trim())
    || getSearchURL(searchTerm.toLowerCase().trim())
}
