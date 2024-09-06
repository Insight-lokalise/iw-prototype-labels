import React from 'react'
import { Locale } from '@insight/toolkit-react'
import { render } from '@testing-library/react'

import AccountCenterQuickLinks from "./AccountCenterQuickLinks";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

describe('AccountCenterQuickLinks', () => {
  it('renders quick links ', () => {
    const { getByText } = render(
      <Locale value={{ locale: 'en_US' }}>
        <AccountCenterQuickLinks />
      </Locale>
    )
    expect(getByText('Orders').closest('a')).toHaveAttribute('href', '/insightweb/orderHistory')
    expect(getByText('Quotes').closest('a')).toHaveAttribute('href', '/insightweb/quotes')
    expect(getByText('Invoices').closest('a')).toHaveAttribute('href', '/insightweb/invoices')
  })
})
