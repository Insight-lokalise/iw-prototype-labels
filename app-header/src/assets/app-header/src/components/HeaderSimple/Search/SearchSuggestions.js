import React, { useContext, useEffect } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import HeaderContext from '@insight/toolkit-react/lib/Header/HeaderContext'
import SearchSuggestion from './SearchSuggestion'
import SearchProductPreview from './SearchProductPreview'
import SearchDoc from './SearchDoc'

export default function SearchSuggestions({
  onSelect,
  query,
  removeSuggestion,
  suggestionSet,
  isDesktop,
  isGuestSearch,
  isIPSUserWithContract,
  isSingleContract,
  showOverlayOnFocus,
}) {
  const { isSearchActive, isSuggestionsActive, setSuggestionsActive } =
    useContext(HeaderContext)
  const {
    suggestions,
    products,
    docs,
    fusionQueryId,
    salesOrg,
    origParams,
    signalMetaData,
    currency,
  } = suggestionSet || {}

  /**
   * When either the suggestions change, or the search bar is activated (or
   * deactivated) then update the `isSuggestionsActive` flag accordingly.
   */

  const hasSuggestions = suggestions?.length > 0
  const hasProducts = products?.length > 0
  const hasDocs = docs?.length > 0
  const hasSuggestionsOrProducts = hasSuggestions || hasProducts || hasDocs
  const showForDesktop =
    isDesktop && (showOverlayOnFocus || hasSuggestionsOrProducts)
  const showForMobile = !isDesktop && (hasSuggestions || hasDocs)

  useEffect(() => {
    setSuggestionsActive(isSearchActive && (showForDesktop || showForMobile))
  }, [suggestions, isSearchActive])

  if (showForDesktop && !hasSuggestionsOrProducts) return null

  return (
    <div
      className={cn(
        'c-search-suggestions',
        { 'is-visible': isSuggestionsActive },
        { 'c-header-search-suggestions': isGuestSearch }
      )}
    >
      <div className="o-grid">
        {(hasSuggestions || hasDocs) && (
          <div
            className={cn('c-search-suggestions__products u-1/1', {
              'u-1/2': isDesktop && hasProducts,
            })}
          >
            {hasSuggestions && (
              <ul
                className="o-list-bare  c-search-suggestions__list"
                aria-label={t('Search suggestions')}
              >
                {removeSuggestion && (
                  <li className="c-search-suggestions__header o-grid u-show@desktop">
                    {t('Recent searches')}
                  </li>
                )}
                {suggestions.map((suggestion, index) => (
                  <SearchSuggestion
                    key={index}
                    onSelect={onSelect}
                    query={query}
                    removeSuggestion={removeSuggestion}
                    suggestion={suggestion}
                  />
                ))}
              </ul>
            )}
            {!removeSuggestion && hasDocs && (
              <ul
                className="o-list-bare  c-search-suggestions__docs"
                aria-label={t('Search docs')}
              >
                <>
                  {hasSuggestions && (
                    <li>
                      <hr className="c-search-suggestions__docs-divider" />
                    </li>
                  )}
                  <li className="c-search-suggestions__header o-grid">
                    {t('Solutions & additional resources')}
                  </li>
                  {docs.map((doc, index) => (
                    <SearchDoc
                      key={index}
                      doc={doc}
                      query={query}
                      position={index + 1}
                    />
                  ))}
                </>
              </ul>
            )}
          </div>
        )}
        {isDesktop && hasProducts && !removeSuggestion && (
          <div
            className={cn('c-search-suggestions__products o-grid__item', {
              'u-1/2': hasSuggestions,
            })}
          >
            <div className="c-search-suggestions__header">
              {t('Recommended products')}
            </div>
            {products.map((product, index) => (
              <SearchProductPreview
                key={index}
                product={product}
                hasSuggestions={hasSuggestions}
                fusionQueryId={fusionQueryId}
                signalMetaData={signalMetaData}
                salesOrg={salesOrg}
                origParams={origParams}
                query={query}
                currency={currency}
                isIPSUserWithContract={isIPSUserWithContract}
                isSingleContract={isSingleContract}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

SearchSuggestions.propTypes = {
  onSelect: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  removeSuggestion: PropTypes.func,
  suggestionSet: PropTypes.object,
  isDesktop: PropTypes.bool.isRequired,
  isGuestSearch: PropTypes.bool,
  showOverlayOnFocus: PropTypes.bool,
}

SearchSuggestions.defaultProps = {
  removeSuggestion: null,
  suggestionSet: null,
  isGuestSearch: false,
  showOverlayOnFocus: false,
}
