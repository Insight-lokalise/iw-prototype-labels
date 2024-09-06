import React from 'react'
import { render, waitFor } from '@testing-library/react'

import PaymentsHeader from "./PaymentsHeader";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

jest.mock('app-api-user-service', ()=>{return {}}, {virtual: true})

describe('Payments Header', () => {
  test('renders correctly', async () => {
    const { getByText } = render(<PaymentsHeader />)

    expect(getByText('Loading...')).toBeInTheDocument()
    expect(getByText('Payment methods')).toBeInTheDocument()
  })
  
  test('renders with mocked data', async () => {
    const { getByText, getByLabelText } = render(<PaymentsHeader />)

    await waitFor(() => {
     expect(getByLabelText('Default payment method'))
    })

    expect(getByText('Update')).toBeInTheDocument();
    expect(getByText('Credit card')).toBeInTheDocument();
  })
})
