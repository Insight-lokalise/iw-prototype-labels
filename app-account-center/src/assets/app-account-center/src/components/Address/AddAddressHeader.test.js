import React from 'react'
import {act, render} from '@testing-library/react'

import AddAddressHeader from "./AddAddressHeader";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

describe('AddAddressHeader', () => {
  it('renders add address page with title Add Address & address form', async () => {
    const { getByText } = render(<AddAddressHeader />)
    expect(getByText("Add address")).toBeInTheDocument()
  })

  it('renders edit address page with title Edit Address & address form', async () => {
    const { getByText } = render(<AddAddressHeader isEdit />)
    expect(getByText("Edit address")).toBeInTheDocument()
  })
})
