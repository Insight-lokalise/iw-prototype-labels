import React from 'react'
import {render, waitFor} from '@testing-library/react'

import LoginInformation from "./LoginInformation";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

jest.mock('app-api-user-service', ()=>{return {}}, {virtual: true})

describe('LoginInformation', () => {

  it('renders login info tile with loading', async () => {
    const { getByText } = render(<LoginInformation />)
    await waitFor(() => {
      expect(getByText('Loading...'));
    });
    expect(getByText("Loading...")).toBeInTheDocument()
    expect(getByText("Login information")).toBeInTheDocument()
  })

  it('renders login info tile with mocked axios data', async () => {
    const { getByTestId } = render(<LoginInformation />)
    await waitFor(() => {
      expect(getByTestId('userName'));
    });
    expect(getByTestId("userName")).toHaveTextContent("user name")
    expect(getByTestId("password")).toHaveTextContent("*********")
  })
})
