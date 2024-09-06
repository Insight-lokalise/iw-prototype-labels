import React, { useContext } from 'react'
import cn from 'classnames'
import Header from '@insight/toolkit-react/lib/Header/Header'

import { navigateToSearchResults, t } from 'api'

import SearchContext from '../../../context/SearchContext'
import usePermissions from '../../../hooks/usePermissions'
import { MASTHEAD_ICON_TITLES_SEARCH } from '../../../api/common/constants'
import updateSearchHistoryStore from '../../../api/common/updateSearchHistoryStore'
import removeFromSearchHistoryStore from '../../../api/common/removeFromSearchHistoryStore'

export default function Search() {
  const { enableSearch, enableSearchSuggestions } = usePermissions()
  const { getSuggestions, query, setQuery, suggestions } = useContext(SearchContext)
  const title = MASTHEAD_ICON_TITLES_SEARCH

  function onSubmit(searchTerm) {
    updateSearchHistoryStore(searchTerm).then(() => {
      navigateToSearchResults({ searchTerm, source: "k" })
    })
  }

  function onSelect(suggestion) {
    const source = suggestion.link ? "s" : "h";
    updateSearchHistoryStore(suggestion.phrase).then(() => {
      navigateToSearchResults({ ...suggestion, searchTerm: suggestion.phrase, source: source })
    })
  }

  function onRemoveSuggestion(suggestion) {
    removeFromSearchHistoryStore(suggestion).then(() => {
      getSuggestions(query)
    })
  }

  return (
    <Header.Search
      placeholder={t('What can we help you find?')}
      onChange={setQuery}
      onSubmit={onSubmit}
      className={cn({ 'u-invisible': !enableSearch })}
      title={t(title)}
    >
      {enableSearchSuggestions && (
        <Header.Search.Suggestions
          onSelect={onSelect}
          query={query}
          removeSuggestion={query ? null : onRemoveSuggestion}
          suggestions={suggestions}
        />
      )}
    </Header.Search>
  )
}

Search.propTypes = {}
