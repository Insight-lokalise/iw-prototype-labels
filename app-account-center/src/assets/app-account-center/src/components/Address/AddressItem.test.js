import React from 'react'
import {render} from '@testing-library/react'

import AddressItem from "./AddressItem";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

const setup = async ({isDefault, soldTo}) => {
  const handleDelete = jest.fn()
  const handleSetDefault = jest.fn()
  const wrapper = render(<AddressItem 
    isShipping
    address={{
      attentionLine: 'Joe Tester',
      partnerCompany: 'Insight',
      partnerAaddress1: '2250 W PINEHURST BLVD',
      partnerAddress2: '',
      partnerAddress3: '',
      partnerCity: 'Addison',
      partnerState: 'IL',
      partnerZip: '60101-6100',
      partnerPhone: '480-333-1010',
      partnerFunction: 123,
      default: isDefault
    }}
    setDefaultAddress={handleDelete}
    deleteAddressHandler={handleSetDefault}
    soldTo={soldTo}
  />)

  return {
    ...wrapper
  }
}

describe('AddressItem', () => {
  it('renders non-default address tile', async () => {
    const { getByTestId, getByText, queryByText } = await setup({isDefault: false})
    
    const defaultLozenge = queryByText('Default')
    const deleteButton = getByTestId('address-delete-button-123')
    const editButton = getByTestId('address-edit-button-123')
    const setDefaultButton = getByText('Set as default')

    expect(defaultLozenge).not.toBeInTheDocument()
    expect(editButton.closest('.c-panel-border__default')).not.toBeInTheDocument()

    expect(editButton).toBeInTheDocument()
    expect(deleteButton).toBeInTheDocument()
    expect(setDefaultButton).toBeInTheDocument()
  })

  it('renders default address tile', async () => {
    const { getByTestId, getByText, queryByTestId, queryByText } = await setup({isDefault: true})
    
    const deleteButton = queryByTestId('address-delete-button-123')
    const editButton = getByTestId('address-edit-button-123')
    const setDefaultButton = queryByText('Set as default')
    const defaultLozenge = queryByText('Default')

    expect(deleteButton).not.toBeInTheDocument()
    expect(setDefaultButton).not.toBeInTheDocument()

    expect(editButton).toBeInTheDocument()
    expect(defaultLozenge).toBeInTheDocument()
    expect(editButton.closest('.c-panel-border__default')).toBeInTheDocument()
  })

  it('renders soldTo address tile not as default', async () => {
    const { queryByTestId, queryByText } = await setup({isDefault: false, soldTo: 123})
    
    const deleteButton = queryByTestId('address-delete-button-123')
    const editButton = queryByTestId('address-edit-button-123')
    const setDefaultButton = queryByText('Set as default')
    const defaultLozenge = queryByText('Default')

    // soldTo address cannot be edited or deleted
    expect(deleteButton).not.toBeInTheDocument()
    expect(editButton).not.toBeInTheDocument()
    expect(defaultLozenge).not.toBeInTheDocument()
    expect(setDefaultButton.closest('.c-panel-border__default')).not.toBeInTheDocument()

    expect(setDefaultButton).toBeInTheDocument()        
  })

  it('renders soldTo address tile as default', async () => {
    const { queryByTestId, queryByText } = await setup({isDefault: true, soldTo: 123})
    
    const deleteButton = queryByTestId('address-delete-button-123')
    const editButton = queryByTestId('address-edit-button-123')
    const setDefaultButton = queryByText('Set as default')
    const defaultLozenge = queryByText('Default')

    // soldTo address cannot be edited or deleted
    expect(deleteButton).not.toBeInTheDocument()
    expect(editButton).not.toBeInTheDocument()    
    expect(setDefaultButton).not.toBeInTheDocument()

    expect(defaultLozenge.closest('.c-panel-border__default')).toBeInTheDocument()
    expect(defaultLozenge).toBeInTheDocument()      
  })

})
