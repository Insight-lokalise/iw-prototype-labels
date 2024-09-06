import React from 'react'
import {render, waitFor} from '@testing-library/react'

import PersonalInformation from "./PersonalInformation";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

jest.mock('app-api-user-service', ()=>{return {}}, {virtual: true})

describe('PersonalInformation', () => {

  it('renders personal info tile with loading', async () => {
    const { getByText } = render(<PersonalInformation />)
    await waitFor(() => {
      expect(getByText('Loading...'));
    });
    expect(getByText("Loading...")).toBeInTheDocument()
    expect(getByText("Personal information")).toBeInTheDocument()
  })

  it('renders personal info tile with mocked axios data', async () => {
    const { getByTestId } = render(<PersonalInformation />)
    await waitFor(() => {
      expect(getByTestId('name'));
    });
    expect(getByTestId("name")).toHaveTextContent("first name last name")
    expect(getByTestId("accountNumber")).toHaveTextContent("123456789")
  })
})
