import React from 'react'
import {render} from '@testing-library/react'

import AddressesHeader from "./AddressesHeader";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

const setup = async () => {
  const setFilterString = jest.fn()
  const wrapper = render(<AddressesHeader 
    setFilterString={setFilterString}
  />)

  return {
    ...wrapper
  }
}

describe('AddressesHeader', () => {
  it('renders header', async () => {
    const { getByText, getByTestId } = await setup()

    expect(getByText('Addresses')).toBeInTheDocument()
    expect(getByText('Search addresses')).toBeInTheDocument()
    expect(getByTestId('addressFilterInput')).toBeInTheDocument()
    expect(getByTestId('addressFilterButton')).toBeInTheDocument()
    expect(getByText('Add new address')).toBeInTheDocument()
  })  

})
