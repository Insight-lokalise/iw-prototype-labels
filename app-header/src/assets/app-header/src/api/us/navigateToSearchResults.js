import { getRedirectKeywords, getSearchURL } from './'

export default function navigateToSearchResults({ href, searchTerm, source }) {
  getRedirectKeywords()
    .then(({ keywords, redirectURLs }) => {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim()
      let url = redirectURLs[keywords[normalizedSearchTerm]]
      let searchType = {k:"Typed In",h:"History",s:"Suggested","":"NA"}[source] || "";

      const queryInfo = {
        queryKeyword: searchTerm,
        queryType: searchType
      }

      if (!url) {
        url = href || getSearchURL(normalizedSearchTerm,source)
      } else {
        queryInfo.queryRedirect = url;
      }
      /**
       * Set flag 'search-type' to determine how user entered search.
       * Used in Google Analytics in CQ code.
       */
      fireTagEvent("queryInfo",queryInfo);
      localStorage['search-type'] = searchType;
      window["_satellite"] && _satellite.track && _satellite.track("queryInfo");
      return url
    })
    .then(url => {
      window.location = url
    })
}
