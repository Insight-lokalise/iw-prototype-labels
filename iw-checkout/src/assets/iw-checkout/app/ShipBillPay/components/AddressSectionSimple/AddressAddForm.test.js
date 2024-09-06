import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import AddressAddForm from './AddressAddForm'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const states = [
  {
    "key": "AE",
    "value": "APO"
  },
  {
    "key": "CA",
    "value": "California"
  },
  {
    "key": "MA",
    "value": "Massachusetts"
  },
  {
    "key": "TX",
    "value": "Texas"
  },
]
const countries = [
  {
    "key": "US",
    "value": "USA"
  },
  {
    "key": "CA",
    "value": "Canada"
  }
];

jest.mock('../../../../libs/models/Address/address', () => ({
  fetchStatesByCountryCode: jest.fn(() => new Promise((resolve) => resolve(states))),
  fetchCountries: jest.fn(() => new Promise((resolve) => resolve(countries)))
}))




const shippingAddress = {
  address: {
    address1: "1500 W HEBRON PKWY STE 110",
    address2: "",
    address3: "",
    city: "CARROLLTON",
    countryId: "US",
    county: "X",
    poBox: "",
    poBoxZipCode: "",
    state: "TX",
    zipCode: "75010-6531",
    zipExt: ""
  },
  attentionLine: "Bruce Test Default",
  companyName: "Bruce Test Company",
  favoriteName: "",
  id: 21968100,
  notes: "",
  overrideAddress: false,
  phone: "1111111111",

}

const setup = async ({ isShipping }) => {

  const wrapper = render(
    <AddressAddForm
      saveAddress={() => { }}
      createAddress={() => { }}
      messageBoxId=""
      orderMetaData={{}}
      sameAsShippingAddress={shippingAddress}
      isShipping={isShipping}
      toggleIsCreatingAddress={() => { }}
      countryCode="US"
    />)

  return {
    ...wrapper
  }
}

describe('AddressAddForm tests', () => {
  test('Render shipping add form', async () => {
    const { getByText, queryByText } = await setup({ isShipping: true })
    expect(getByText('Add new address')).toBeInTheDocument()
    expect(queryByText('Same as shipping')).not.toBeInTheDocument()
  })
  test('Render billing add form', async () => {
    const { getByText, queryByText } = await setup({ isShipping: false })
    expect(getByText('Add new address')).toBeInTheDocument()
    expect(queryByText('Same as shipping')).toBeInTheDocument()
  })
  test('Show validation errors', async () => {
    const { getByTestId, queryByText } = await setup({ isShipping: false })
    fireEvent.click(getByTestId('save-address-btn'))
    expect(queryByText('Please enter Company.')).toBeInTheDocument()
    expect(queryByText('Please enter Address.')).toBeInTheDocument()
    expect(queryByText('Please enter City.')).toBeInTheDocument()
    expect(queryByText('Please select State / Province.')).toBeInTheDocument()
    expect(queryByText('Please enter Zip / Postal code.')).toBeInTheDocument()
  })
  test('Test same as shipping', async () => {
    const { getByText, getByTestId } = await setup({ isShipping: false })
    fireEvent.click(getByText('Same as shipping'))
    expect(getByTestId('contact-name-input').value).toEqual('Bruce Test Default')
    expect(getByTestId('company-input').value).toEqual('Bruce Test Company')
    expect(getByTestId('address1-input').value).toEqual('1500 W HEBRON PKWY STE 110')
    expect(getByTestId('city-input').value).toEqual('CARROLLTON')
    expect(getByTestId('postal-code-input').value).toEqual('75010-6531')
    expect(getByTestId('phone-input').value).toEqual('1111111111')
    await waitFor(() => {
      expect(getByTestId('state-input').value).toEqual('TX')
    })
  })
})
