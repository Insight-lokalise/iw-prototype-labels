import React from 'react'
import {render, waitFor, fireEvent} from '@testing-library/react'

import AddressesList from "./AddressesList";


jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

jest.mock('app-api-user-service', ()=>({}), {virtual: true})

const setup = async ({
  isShipping, 
  filterString, 
  defaultAddress,
  soldTo,
}) => {
  const addToast = jest.fn()
  const getDefaultAddresses = jest.fn()
  const wrapper = render(<AddressesList
    isShipping={isShipping} 
    filterString={filterString}
    defaultAddress={defaultAddress}
    getDefaultAddresses={getDefaultAddresses}
    addToast={addToast}
    soldTo={soldTo}
  />)

  return {
    ...wrapper,
  }
}

describe('AddressesList render', () => {

  it('renders shipping addresses with default', async () => {
    const { getByText, getAllByText } = await setup({
      isShipping: true,
      filterString: '',
      defaultAddress: {
        "partnerFunction": 40146719        
      }
    })

    await waitFor(() => {
      expect(getByText("Shipping addresses")).toBeInTheDocument()
      expect(getAllByText("Default").length).toEqual(1)
      expect(getAllByText("Set as default").length).toEqual(2)      
    });    

  })
  it('renders shipping addresses without default', async () => {
    const { getByText, getAllByText, queryByText } = await setup({
      isShipping: true,
      filterString: '',
      defaultAddress: {}
    })

    await waitFor(() => {
      expect(queryByText('Default')).not.toBeInTheDocument()
      expect(getByText("Shipping addresses")).toBeInTheDocument()
      expect(getAllByText("Set as default").length).toEqual(3)
    })

  })

  it('renders shipping soldTo address as default if no default is set', async () => {
    const { getByText, getAllByText, queryByText } = await setup({
      isShipping: true,
      filterString: '',
      defaultAddress: {},
      soldTo: 10285059
    })

    await waitFor(() => {
      expect(queryByText('Default')).toBeInTheDocument()
      // make sure soldTo address is the default address
      expect(queryByText('Default').closest('.c-panel').querySelector('.c-address-section').textContent.includes("WEB Test I changed the name")).toBe(true)
      expect(getByText("Shipping addresses")).toBeInTheDocument()
      expect(getAllByText("Set as default").length).toEqual(2)
    })

  })
  
  it('renders billing addresses with default', async () => {
    const { getByText, getAllByText } = await setup({
      isShipping: false,
      filterString: '',
      defaultAddress: {
        "partnerFunction": 40146719        
      }
    })

    await waitFor(() => {
      expect(getByText("Billing addresses")).toBeInTheDocument()
      expect(getAllByText("Default").length).toEqual(1)
      expect(getAllByText("Set as default").length).toEqual(2)
    });    

  })
  it('renders billing addresses without default', async () => {
    const { getByText, getAllByText, queryByText } = await setup({
      isShipping: false,
      filterString: '',
      defaultAddress: {}
    })

    await waitFor(() => {
      expect(queryByText('Default')).not.toBeInTheDocument()
      expect(getByText("Billing addresses")).toBeInTheDocument()
      expect(getAllByText("Set as default").length).toEqual(3)
    })

  })

  it('renders billing soldTo address as default if no default is set', async () => {
    const { getByText, getAllByText, queryByText } = await setup({
      isShipping: false,
      filterString: '',
      defaultAddress: {},
      soldTo: 10285059
    })

    await waitFor(() => {
      expect(queryByText('Default')).toBeInTheDocument()
      // make sure soldTo address is the default address
      expect(queryByText('Default').closest('.c-panel').querySelector('.c-address-section').textContent.includes("WEB Test I changed the name")).toBe(true)
      expect(getByText("Billing addresses")).toBeInTheDocument()
      expect(getAllByText("Set as default").length).toEqual(2)
    })

  })
  
})

describe('AddressesList actions', () => {

  it('test address filter with 1 result', async () => {
    const { getAllByText } = await setup({
      isShipping: true,
      filterString: 'TEMPE',
      defaultAddress: {}
    })

    await waitFor(() => {      
      expect(getAllByText("Set as default").length).toEqual(1)
    })

  })
  it('test address filter with no results', async () => {
    const { getByText } = await setup({
      isShipping: true,
      filterString: 'xyz',
      defaultAddress: {
        "partnerFunction": 40146719        
      }
    })

    await waitFor(() => {      
      expect(getByText("No shipping address available")).toBeInTheDocument()
    })

  })

  it('test address delete confirmation modal', async () => {
    const { getByText, getByTestId } = await setup({
      isShipping: true,
      filterString: '',
      defaultAddress: {}
    })

    await waitFor(() => {
      expect(getByTestId("address-delete-button-10285059")).toBeInTheDocument()
      fireEvent.click(getByTestId("address-delete-button-10285059"))
      expect(getByText("Are you sure you want to delete this address?")).toBeInTheDocument()

    })

  })
  
})
