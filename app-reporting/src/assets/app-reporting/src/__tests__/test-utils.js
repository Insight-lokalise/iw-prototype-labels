import React from 'react'
import { render } from '@testing-library/react'
import { Locale } from '@insight/toolkit-react/lib/Locale/Locale'
const AllTheProviders = ({ children }) => {
  return (
    <Locale
      value={{
        pingDomain: 'https://dev-id.insight.com',
        pingClientId: '6d3d3ff0-ce9c-41ab-887d-5827e9e551b7',
        locale: 'en_US',
      }}
    >
      {children}
    </Locale>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
