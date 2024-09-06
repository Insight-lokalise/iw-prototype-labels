import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../../../__tests__/test-utils'
import StoredAddressLinkSimpleView from './StoredAddressLinkSimpleView'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const selectedAddress = {
  address: {
    address1: "1500 W HEBRON PKWY STE 110",
    address2: "",
    address3: "",
    city: "CARROLLTON",
    countryId: "US",
    county: "X",
    poBox:"",
    poBoxZipCode: "",
    state: "TX",
    zipCode: "75010-6531",
    zipExt: ""
  },
  attentionLine: "Bruce Test Name",
  companyName: "Bruce Test Company",
  favoriteName: "",
  id: 21968100,
  notes: "",
  overrideAddress: false,
  phone: "1111111111",

}

const storedAddresses = {
  defaultAddress: null, 
  savedAddresses: [],
  defaultAddress: null,
  savedAddresses: [],
  startPage: 1,
  totalPages: 1,
  totalRecords: 10,
}

const setup = async ({isShipping}) => {

  const wrapper = render(    
    <StoredAddressLinkSimpleView
        selectedAddress={selectedAddress}
        storedAddresses={storedAddresses}
        isShipping={isShipping}
        messageBoxId=""
        selectAddress={() => {}}
      />)

  return {
    ...wrapper
  }
}

describe('StoredAddressLinkSimpleView tests', () => {
  test('Render stored address link', async () => {
    const { getByText } = await setup({isShipping: true});
    expect(getByText('Stored addresses')).toBeInTheDocument()
  })
  test('Render shipping modal on click', async () => {
    const { getByText, queryByText } = await setup({isShipping: true});
    fireEvent.click(getByText('Stored addresses'))
    await waitFor(() => {
      expect(queryByText('Current shipping address')).toBeInTheDocument()
    });
  })
})
