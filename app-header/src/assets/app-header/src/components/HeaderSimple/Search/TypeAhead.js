import React from 'react'
import TypeAheadInput from './TypeAheadInput'

export default function TypeAhead(props) {
  const { 
    suggestionSet,
    isDesktop,
    isSearchActive,
    isSearchHistory,
    value,
    ...rest
  } = props

  const { suggestions } = suggestionSet || {}

  const searchForHint = () => {
    const normalizedValue = value.toLowerCase()    

    return suggestions.find((suggestion) => {
      const normalizeSuggestion = suggestion?.value?.toLowerCase() || ''
      return normalizeSuggestion.indexOf(normalizedValue) === 0
    })
  }

  const getHint = () => {

    let hintKeyword = ''

    if(isDesktop && isSearchActive && !isSearchHistory && suggestions) {
        //look for typeahead hint candidate in the suggetions list
        const foundHint = searchForHint()
        if(foundHint) {
          //merge user typed value with hint
          hintKeyword = value + foundHint.value.substring(value.length)
        }
    }

    return hintKeyword
  }

  const hint = getHint()

  return (
    <TypeAheadInput
      hint={hint}
      value={value}
      name='header'
      {...rest}
    />
  )
}
