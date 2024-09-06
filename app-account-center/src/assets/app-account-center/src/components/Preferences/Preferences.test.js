import React from 'react'
import {render, waitFor} from '@testing-library/react'

import Preferences from "./Preferences";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

jest.mock('app-api-user-service', ()=>{return {}}, {virtual: true})

describe('Preferences', () => {

  test('renders preferences tile with loading', async () => {
    const { getByText } = render(<Preferences />)
    await waitFor(() => {
      expect(getByText('Loading...'));
    });
    expect(getByText("Loading...")).toBeInTheDocument()
    expect(getByText("Preferences")).toBeInTheDocument()
  })

  test('renders preferences tile with mocked axios data', async () => {
    const { getByText } = render(<Preferences />)
    await waitFor(() => {
      expect(getByText('Email format'));
    });
    expect(getByText("HTML")).toBeInTheDocument()
    expect(getByText("On orders placed")).toBeInTheDocument()
    expect(getByText("On quotes placed")).toBeInTheDocument()
  })
})