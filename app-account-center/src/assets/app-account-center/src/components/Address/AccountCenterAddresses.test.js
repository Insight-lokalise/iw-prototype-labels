import React from 'react'
import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'

import AccountCenterAddresses from "./AccountCenterAddresses";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

jest.mock('app-api-user-service', ()=>{return {}}, {virtual: true})

describe('AccountCenterAddresses', () => {
  it('renders Addresses tile with loading', async () => {
    const { getByText } = render(<AccountCenterAddresses />)
    expect(getByText("Loading...")).toBeInTheDocument()
    expect(getByText("Addresses")).toBeInTheDocument()
  })

  it('renders Addresses info tile with mocked axios data', async () => {
    const { getByTestId, getByText } = render(<AccountCenterAddresses />, {wrapper: MemoryRouter})
    await waitFor(() => {
      expect(getByTestId('shipping-address'));
    });
    expect(getByTestId("shipping-address")).toBeInTheDocument()
    expect(getByTestId("billing-address")).toBeInTheDocument()
    expect(getByText(/NSIT Austin/i)).toBeInTheDocument()
    expect(getByText(/NSIT Addison/i)).toBeInTheDocument()
  })
})
