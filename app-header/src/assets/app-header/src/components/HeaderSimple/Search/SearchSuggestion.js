import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'
import Button from '@insight/toolkit-react/lib/Button/Button'

export default function SearchSuggestion({ onSelect, query, removeSuggestion, suggestion }) {
  const { value, categoryLabel, categoryCode } = suggestion

  const normalizedPhase = value.toLowerCase()
  const normalizeQuery = query.toLowerCase()

  const hasMatch = normalizedPhase.indexOf(normalizeQuery) !== -1
  const matchStartIndex = hasMatch ? normalizedPhase.indexOf(normalizeQuery) : 0
  const matchEndIndex = hasMatch ? matchStartIndex + normalizeQuery.length : 0

  const before = value.slice(0, matchStartIndex)
  const match = value.slice(matchStartIndex, matchEndIndex)
  const after = value.slice(matchEndIndex)

  function handleClick(event, isCategory) {
    event.preventDefault()
    onSelect(suggestion, isCategory)
  }

  const hasCategory = categoryLabel && categoryCode

  return (
    <>
      <li className={cn('c-search-suggestions__item o-grid', {'c-search-suggestions__item-divider': !hasCategory })}>
        <Button
          icon={removeSuggestion ? 'time' : ''}
          color="subtle"
          fullWidth
          onClick={(event) => handleClick(event, false)}
          className='c-search-suggestions__btn o-grid__item'
          tabIndex={0}
        >
          {before}
          <span className="c-search-suggestions__match">{match}</span>
          {after}
        </Button>
        {removeSuggestion && (
          <Button
            className="o-grid__item o-grid__item--shrink"
            icon="close"
            onClick={() => {
              removeSuggestion(suggestion)
            }}
            size="small"
            aria-label={t("Delete search suggestion")}
            tabIndex={0}
          />
        )}
      </li>
      {(hasCategory)  && (
        <li className='c-search-suggestions__item c-search-suggestions__category c-search-suggestions__item-divider o-grid'>
          <Button
            color="subtle"
            fullWidth
            onClick={(event) => handleClick(event, true)}
            className="c-search-suggestions__btn o-grid__item"
            tabIndex={0}
          >
            {` ${t('in')} `} {categoryLabel}
          </Button>
        </li>
      )}
    </>
  )
}

SearchSuggestion.propTypes = {
  onSelect: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  removeSuggestion: PropTypes.func,
  suggestion: PropTypes.shape({}).isRequired,
}

SearchSuggestion.defaultProps = {
  removeSuggestion: null,
}
