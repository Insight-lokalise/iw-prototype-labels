import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'

import PreferencesModal from './PreferencesModal'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn((string) => string),
}))

jest.mock(
  'app-api-user-service',
  () => {
    return {}
  },
  { virtual: true }
)

window.scroll = jest.fn()
const setup = async () => {
  const onSubmit = jest.fn()
  const onClose = jest.fn()
  const prefs = {
    emailFormat: 'HTML',
    emailQuotes: true,
    orderQuotes: true,
  }
  const wrapper = render(
    <PreferencesModal onSubmit={onSubmit} onClose={onClose} prefs={prefs} />
  )

  const formWrapper = wrapper.getByTestId('preferences-form')
  return {
    onSubmit,
    formWrapper,
    ...wrapper,
  }
}

describe('Preferences editable form', () => {
  it('renders Preferences editable form when clicked on edit button', async () => {
    const { formWrapper } = await setup()
    expect(formWrapper).toBeInTheDocument()
  })

  it('renders preferences form data', async () => {
    const { getByTestId } = await setup()
    expect(getByTestId('HTML')).toBeInTheDocument()
    expect(getByTestId('PDF')).toBeInTheDocument()
    expect(getByTestId('on-orders-placed')).toBeInTheDocument()
    expect(getByTestId('on-quotes-placed')).toBeInTheDocument()
  })

  it('Should have order and quotes check boxes checked with mock', async () => {
    const { getByTestId } = await setup()
    expect(getByTestId('on-orders-placed').checked).toBeTruthy()
    expect(getByTestId('on-quotes-placed').checked).toBeTruthy()
  })

  it('Should have email format as HTML with mock', async () => {
    const { getByTestId } = await setup()
    expect(getByTestId('HTML').checked).toBeTruthy()
    expect(getByTestId('PDF').checked).toBeFalsy()
  })

  test('Should submit on save', async () => {
    const { getByText, getByTestId, queryByTestId, onSubmit } = await setup()
    fireEvent.click(getByTestId('perferences-save-btn'))
    expect(onSubmit).toBeCalledTimes(1)
  })
})
