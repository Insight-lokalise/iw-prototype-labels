import { getRedirectKeywords, getSearchURLSimple } from '.'

export default function navigateToSearchResultsSimple({ value, categoryCode, isCategory, source }) {
  getRedirectKeywords()
    .then(({ keywords, redirectURLs }) => {
      const normalizedSearchTerm = value.toLowerCase().trim()      
      const searchType = {k:"Typed In",h:"History",s:"Suggested",c:"Suggested - Category",p:"Suggested - Product","":"NA"}[source] || "";
      const queryInfo = {
        queryKeyword: value,
        queryType: searchType
      }

      let url = redirectURLs[keywords[normalizedSearchTerm]]

      if (!url) {
        url = getSearchURLSimple(normalizedSearchTerm, categoryCode, isCategory, source)
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
