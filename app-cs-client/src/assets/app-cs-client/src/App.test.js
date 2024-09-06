import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { mockWebgroupSettings } from './__tests__/webgroupSettings'
import App from './App'

jest.mock('@insight/toolkit-utils/lib/labels', () => {
  return {
    t: jest.fn(string => string),
    l: jest.fn()
  }
})
jest.mock('react-redux', () => {
  return {
    useDispatch: jest.fn(() => () => null),
    useSelector: jest.fn(() => () => {
      return {
        isLoaded: true,
        webGroupSettings: mockWebgroupSettings
      }
    })
  }
})

describe('App test', () => {
  test('renders correctly', () => {
    const { getByText } = render(<App />)

    expect(getByText('Loading...')).toBeInTheDocument()
  })

  test('renders correctly after load', () => {
    const { getByText } = render(<App />)

    waitFor(() => {
      expect(getByText('Company Standards - Test')).toBeInTheDocument()
    })
  })
})