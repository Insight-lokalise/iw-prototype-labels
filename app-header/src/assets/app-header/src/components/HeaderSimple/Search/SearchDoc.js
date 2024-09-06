import React from 'react'
import PropTypes from 'prop-types'
import Button from '@insight/toolkit-react/lib/Button/Button'

export default function SearchDoc({ position, doc, query }) {
  const { pagePath, title } = doc

  if (!title || !pagePath) return null

  const normalizedPhase = title.toLowerCase()
  const normalizeQuery = query.toLowerCase()

  const hasMatch = normalizedPhase.includes(normalizeQuery)
  const matchStartIndex = hasMatch ? normalizedPhase.indexOf(normalizeQuery) : 0
  const matchEndIndex = hasMatch ? matchStartIndex + normalizeQuery.length : 0

  const before = title.slice(0, matchStartIndex)
  const match = title.slice(matchStartIndex, matchEndIndex)
  const after = title.slice(matchEndIndex)

  function handleClick(event) {
    event.preventDefault()

    const searchType = 'Suggested search'
    const queryInfo = {
      queryKeyword: query,
      queryType: searchType,
      suggestedQueryLink: title,
      queryPosition: position,
    }

    /**
     * Set flag 'search-type' to determine how user entered search.
     * Used in Google Analytics in CQ code.
     */

    fireTagEvent('queryInfo', queryInfo)

    localStorage['search-type'] = searchType
    window._satellite && _satellite.track && _satellite.track('queryInfo')

    window.location.href = pagePath
  }

  return (
    <>
      <li className="c-search-suggestions__item o-grid c-search-suggestions__item-divider">
        <Button
          color="subtle"
          fullWidth
          onClick={(event) => handleClick(event)}
          className="c-search-suggestions__btn o-grid__item"
          tabIndex={0}
        >
          {before}
          <span className="c-search-suggestions__match">{match}</span>
          {after}
        </Button>
      </li>
    </>
  )
}

SearchDoc.propTypes = {
  doc: PropTypes.shape({}).isRequired,
  query: PropTypes.string.isRequired,
}
