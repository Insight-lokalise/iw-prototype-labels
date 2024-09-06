import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Locale } from '@insight/toolkit-react/lib/Locale/Locale'

import { store } from '../app/libs/storeConfig'

const AllTheProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <Locale value={{ locale: 'en_US' }}>
        {children}
      </Locale>
    </Provider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }