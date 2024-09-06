import React from 'react'

import { SearchSimpleContextProvider } from '../../../context/SearchSimpleContext'
import GuestSearchBar from '../GuestSearchBar'
import Search from './Search'

export default function SearchSwitchComponent({
  isGuestSearchEnabled = false,
  isDesktop = false,
}) {
  if (!isGuestSearchEnabled) {
    return <Search />
  }
  return (
    <SearchSimpleContextProvider>
      <GuestSearchBar isDesktop={isDesktop} />
    </SearchSimpleContextProvider>
  )
}
