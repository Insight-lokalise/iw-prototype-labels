import React from 'react'
import {render, fireEvent} from '@testing-library/react'

import AccountItem from "./AccountItem";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

const updateDefaultAccountHandler = jest.fn()
const handleAccountSelect = jest.fn()

const setup = async ({isDefault = false, soldTo}) => {

  const account = {
    "soldtoName": "100-HOTEL PULITZER",
    isDefault,
    "address": {
      "zipCode": "1016GZ",
      "address3": "",
      "address2": "",
      "city": "AMSTERDAM",
      "address1": "PRINSENGRACHT 315-331",
      "county": "",
      "state": "08 ",
      "countryId": "NL "
    },
    "phoneNumber": null,
    "soldtoNumber": 10759074,
  }
  const wrapper = render(<AccountItem
    account={account}
    currentSoldToNumber={soldTo}
    setDefaultAccount={updateDefaultAccountHandler}
    handleAccountSelect={handleAccountSelect}
  />)

  return {
    ...wrapper
  }
}

describe('AccountItem', () => {
  it('renders non-default account tile', async () => {
    const { getByText, queryByText } = await setup({isDefault: false, soldTo: 123456789})

    const defaultLozenge = queryByText('Default')
    const setDefaultButton = getByText('Set as default')
    const selectButton = getByText('Select')

    expect(defaultLozenge).not.toBeInTheDocument()
    expect(setDefaultButton).toBeInTheDocument()
    expect(selectButton).toBeInTheDocument()
  })

  it('renders default account tile', async () => {
    const { getByText, queryByText } = await setup({isDefault: true, soldTo: 123456789})

    const defaultLozenge = queryByText('Default')
    const setDefaultButton = queryByText('Set as default')
    const selectButton = getByText('Select')

    expect(defaultLozenge).toBeInTheDocument()
    expect(setDefaultButton).not.toBeInTheDocument()
    expect(selectButton).toBeInTheDocument()
  })

  it('renders current account tile may not be default', async () => {
    const { queryByText } = await setup({isDefault: false, soldTo: 10759074})

    const defaultLozenge = queryByText('Default')
    const currentLozenge = queryByText('Current')
    const setDefaultButton = queryByText('Set as default')
    const selectButton = queryByText('Select')

    expect(defaultLozenge).not.toBeInTheDocument()
    expect(setDefaultButton).toBeInTheDocument()
    expect(currentLozenge).toBeInTheDocument()
    expect(selectButton).not.toBeInTheDocument()
  })

  it('renders current & default account tile', async () => {
    const { queryByText } = await setup({isDefault: true, soldTo: 10759074})

    const defaultLozenge = queryByText('Default')
    const currentLozenge = queryByText('Current')
    const setDefaultButton = queryByText('Set as default')
    const selectButton = queryByText('Select')

    expect(defaultLozenge).toBeInTheDocument()
    expect(setDefaultButton).not.toBeInTheDocument()
    expect(currentLozenge).toBeInTheDocument()
    expect(selectButton).not.toBeInTheDocument()
  })

  it('Should trigger select account handler upon clicking in select button', async () => {
    const { queryByText } = await setup({isDefault: false, soldTo: 12345})

    const selectButton = queryByText('Select')
    fireEvent.click(selectButton)
    expect(handleAccountSelect).toHaveBeenCalled()
  })

  it('Should trigger set as default handler upon clicking in set as default button', async () => {
    const { queryByText } = await setup({isDefault: false, soldTo: 12345})

    const setDefaultButton = queryByText('Set as default')
    fireEvent.click(setDefaultButton)
    expect(updateDefaultAccountHandler).toHaveBeenCalled()
  })
})
