import React, { useContext, useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import useOutsideClick from '@insight/toolkit-react/lib/Header/useOutsideClick'
import HeaderContext from '@insight/toolkit-react/lib/Header/HeaderContext'
import KEY_CODES from '@insight/toolkit-utils/lib/types/keyCodes'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'
import { t } from '@insight/toolkit-utils/lib/labels'
import { navigateToSearchResultsSimple } from 'api'

import SearchSimpleContext from '../../../context/SearchSimpleContext'
import usePermissions from '../../../hooks/usePermissions'
import SearchSuggestions from './SearchSuggestions'
import TypeAhead from './TypeAhead'
import { MASTHEAD_ICON_TITLES_SEARCH } from '../../../api/common/constants'
import updateSearchHistoryStoreSimple from '../../../api/common/updateSearchHistoryStoreSimple'
import removeFromSearchHistoryStoreSimple from '../../../api/common/removeFromSearchHistoryStoreSimple'
import useDefaultOverlay from '../../../hooks/useDefaultOverlay'
import IAHeaderContext from "../../../context/IAHeaderContext";

export default function SearchBar({ isDesktop }) {
  const { enableSearch, enableSearchSuggestions } = usePermissions()
  const {
    isSearchActive,
    setSearchActive,
    setActiveFlyout,
    setSuggestionsActive,
    closeMegaMenu,
  } = useContext(HeaderContext)
  const { headerInfo: { isLoggedIn, isCES  } } = useContext(IAHeaderContext)
  const { getLWSearch, getSuggestions, query, setQuery, suggestions } =
    useContext(SearchSimpleContext)
  const [searchString, setSearchString] = useState('')
  const searchRef = useRef(null)
  const placeholder = isDesktop
    ? t('Search for hardware, software, solutions and more…')
    : t('Search Insight...')

  useEffect(() => {
    setSearchActive(false)

    return () => {
      setSearchActive(false)
      setSuggestionsActive(false)
    }
  }, [])

  const { setDefaultOverlay } = useDefaultOverlay()

  const onSubmit = async (value, params) => {
    await updateSearchHistoryStoreSimple(value)
    if(isCES || !isLoggedIn) {
      // Search LW using the search value
      const { redirectUrl } = await getLWSearch(value, { start: 0, rows: 0 })
      // Check if a redirect URL is present in the LW response
      if (redirectUrl) return window.location.assign(redirectUrl)
    }
    // Process AME redirect or navigate to search page
    navigateToSearchResultsSimple({ value, source: 'k', ...params })
  }

  const title = MASTHEAD_ICON_TITLES_SEARCH

  function onSelect(suggestion, isCategory) {
    const source =
      //differentiate search term vs history
      suggestion.categoryCode
        ? //when it is search term, differentiate between keyword vs category
          isCategory
          ? 'c'
          : 's'
        : 'h'

    onSubmit(suggestion.value, {
      ...suggestion,
      isCategory,
      source: source,
    })
  }

  function onRemoveSuggestion(suggestion) {
    removeFromSearchHistoryStoreSimple(suggestion).then(() => {
      getSuggestions(query)
    })
  }

  /**
   * When the user focuses the input (either for the first time, or to amend
   * the searchh query) trigger the on change handler, giving the app chance
   * to display something (such as history) when there is no query.
   */
  function handleFocus() {
    if (isDesktop) {
      setDefaultOverlay(false)
    }
    if (!isSearchActive) {
      setActiveFlyout(null)
      setSearchActive(true)
      setQuery(searchString)
      closeMegaMenu()
    }
  }

  /**
   * When the search query changes, track it locally, and inform the parent
   * component of the new value.
   */
  function handleChange({ target: { value } }) {
    setSearchString(value)
    setQuery(value)
  }

  /**
   * When the submit button is clicked, inform the parent component.
   */
  function handleSubmit() {
    onSubmit(searchString)
  }

  /**
   * Capture 'Enter' key presses when the input has focus, and submit the
   * search request.
   */
  function handleKeyUp(event) {
    if (event.keyCode === KEY_CODES.ENTER && searchString) {
      event.stopPropagation()
      handleSubmit()
    } else {
      if (!isSearchActive) {
        handleFocus()
      }
    }
  }

  /**
   * Close the search bar when the user click outside, or tabs outside of the
   * search input or the suggestions.
   *
   * Note: Because the button to open the mobile search bar is outside of the
   * search bar itself, useOutsideClick has a strange effect: clicking on the
   * button triggers the outside click behaviour, closing the menu, then the
   * click handler of the button determines that the menu should be reopened.
   * Using setTimeout this way, whilst not ideal, forces the correct order of
   * the handlers to acheive the desired effect. This will have to suffice
   * until we have time to look into how useOutsideClick could be made robust
   * enough to cope. (TODO)
   */
  useOutsideClick(
    () => {
      setDefaultOverlay(true)
      if (isSearchActive) {
        setTimeout(() => setSearchActive(false), 0)
      }
    },
    { ref: searchRef }
  )

  const isSearchHistory =
    !suggestions?.suggestions?.[0]?.categoryCode &&
    !suggestions?.products?.length &&
    !suggestions?.docs?.length

  const render = () => (
    <div
      className={cn('c-search-bar-container', { 'u-invisible': !enableSearch })}
    >
      <div ref={searchRef} className="c-search-bar">
        <form
          className="c-form  c-form--small"
          onSubmit={(e) => {
            e.preventDefault()
          }}
          role="search"
        >
          <div className="o-grid">
            <div className="o-grid__item">
              <TypeAhead
                ariaLabel={t('Search')}
                autoComplete="off"
                className="c-search-input c-search-bar__input"
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleKeyUp={handleKeyUp}
                placeholder={placeholder}
                type="search"
                value={searchString}
                suggestionSet={suggestions}
                isSearchActive={isSearchActive}
                isDesktop={isDesktop}
                isSearchHistory={isSearchHistory}
              />
            </div>
            <div className="o-grid__item  o-grid__item--shrink">
              <Button
                aria-label={t('Search')}
                className="c-search-bar__button"
                color="subtle"
                onClick={searchString ? handleSubmit : handleFocus}
              >
                <Icon icon="search" title={t(title)} />
              </Button>
            </div>
          </div>
        </form>
        {enableSearchSuggestions && (
          <SearchSuggestions
            onSelect={onSelect}
            query={query}
            removeSuggestion={!isSearchHistory ? null : onRemoveSuggestion}
            suggestionSet={suggestions}
            isDesktop={isDesktop}
            showOverlayOnFocus={true}
          />
        )}
      </div>
    </div>
  )

  return isDesktop ? (
    render()
  ) : (
    <li className="c-header-simple-mob__li">{render()}</li>
  )
}

SearchBar.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
}
