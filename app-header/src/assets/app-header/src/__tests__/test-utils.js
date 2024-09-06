import React from 'react'
import { render } from '@testing-library/react'
import IAHeaderContext from '../context/IAHeaderContext'
import { SearchSimpleContextProvider } from '../context/SearchSimpleContext'
import { SearchContextProvider } from '../context/SearchContext'
import ModalContextProvider from '../components/Modal/ModalContextProvider'
import { Locale } from '@insight/toolkit-react/lib/Locale/Locale'
import {headerInfo} from "./headerInfo";
import {menuItems} from "./menuItems";
const AllTheProviders = ({ children }) => {
  const filteredItemMap = {
    "a2d744912e28497a1e789a3cf752b904cae8cd879888995d3e0eb9599ba39a51":true,
    "e98125692853230134bb8bbab60e9bed8d794ae7e234e81e9c91e393d72a9acd":true,
    "14f90800ea5966743762909f0ede296a80dd4cd2f420a097d7893a304dff394b":true,
    "6511a5cc059fb4d924606b56a691ab70f4b5b69316c1ecbad3e84cd9cc23b20b":true,
    "c3ecff78b2a34e2f5a17165480329da4e0d259e115931f730b048a0118b4c265":true,
    "649864187f817a8f70782d8cef8d71b5e0e9e77602dfe3ef6543c7593e6b1c1b":true}
  return (
    <Locale value={{ locale: 'en_US' }}>
      <IAHeaderContext.Provider value={{filteredItemMap, headerInfo, menuItems}}>
        <SearchContextProvider>
          <SearchSimpleContextProvider>
            <ModalContextProvider>
              {children}
            </ModalContextProvider>
          </SearchSimpleContextProvider>
        </SearchContextProvider>
      </IAHeaderContext.Provider>
    </Locale>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })



// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
