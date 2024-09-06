import React from 'react'
import { render } from '@testing-library/react'

import AccountCenterHeader from "./AccountCenterHeader";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

describe('AccountCenterHeader', () => {
  it('renders heading', () => {
    const { container, getByText } = render(<AccountCenterHeader />)
    expect(getByText("Account settings")).toBeInTheDocument()
  })
})
