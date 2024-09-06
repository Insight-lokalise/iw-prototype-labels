import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import AddressContactForm from './AddressContactForm'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const overrideFields = {
  attentionLine: "Bruce Test Name",
  companyName: "Bruce Test Company",
  phone: "1111111111",
}

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
  attentionLine: "Bruce Test Default",
  companyName: "Bruce Test Company",
  favoriteName: "",
  id: 21968100,
  notes: "",
  overrideAddress: false,
  phone: "1111111111",

}

const setup = async ({contactFields, isDefaultAddress}) => {

  const wrapper = render(
    <AddressContactForm
        overrideFields={contactFields}      
        selectedAddress={selectedAddress}        
        setOverrideFields={()=>{}}
        saveAddress={() => {}}
        isDefaultAddress={isDefaultAddress}
      />)

  return {
    ...wrapper
  }
}

describe('AddressContactForm tests', () => {
  test('Render default address', async () => {
    const { getByText, getByTestId } = await setup({contactFields: overrideFields, isDefaultAddress: true});
    expect(getByTestId('attentionLine-input').value).toEqual('Bruce Test Name')
    expect(getByText('Bruce Test Company')).toBeInTheDocument()
    expect(getByTestId('phone-input').value).toEqual('1111111111')
    expect(getByText(/1500 W HEBRON PKWY STE 110/i)).toBeInTheDocument()
    expect(getByText(/CARROLLTON, TX 75010-6531/i)).toBeInTheDocument()
    expect(getByText(/US/i)).toBeInTheDocument()
    expect(getByText("Default")).toBeInTheDocument()
  })
  test('Render non-default address', async () => {
    const { queryByText } = await setup({contactFields: overrideFields, isDefaultAddress: false});
    expect(queryByText("Default")).not.toBeInTheDocument()
  })
  test('Test validations', async () => {
    const { queryByText, getByTestId } = await setup({contactFields: {}, isDefaultAddress: false});
    const continueButton = getByTestId('continue-button')
    const contactName = getByTestId('attentionLine-input')
    const phone = getByTestId('phone-input')
    
    fireEvent.change(phone, {target: {value: 'abc'}})
    fireEvent.click(continueButton)
    expect(queryByText("Please enter a valid Phone.")).toBeInTheDocument()

    fireEvent.change(contactName, {target: {value: 'test'}})
    fireEvent.change(phone, {target: {value: ''}})
    fireEvent.click(continueButton)
    expect(queryByText("Please enter a valid Phone.")).not.toBeInTheDocument()
    
  })
})
