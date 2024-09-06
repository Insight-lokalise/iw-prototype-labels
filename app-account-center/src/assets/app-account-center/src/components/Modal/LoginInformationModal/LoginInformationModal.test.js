import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { LoginInformationModal } from '../LoginInformationModal'

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

document.domain = 'localhost'

window.scroll = jest.fn()
const setup = async () => {
  const onSubmit = jest.fn()
  const onClose = jest.fn()
  const setUserNameAvailabilityStatus = jest.fn()
  const wrapper = render(
    <LoginInformationModal
      onSubmit={onSubmit}
      onClose={onClose}
      setUserNameAvailabilityStatus={setUserNameAvailabilityStatus}
      userNameAvailabilityStatus="same"
      userName="user name"
    />
  )
  const formWrapper = wrapper.getByTestId('login-info-form')
  return {
    onSubmit,
    formWrapper,
    ...wrapper,
  }
}

describe('loginInformation editable form', () => {
  it('renders login info editable form when clicked on edit button', async () => {
    const { formWrapper } = await setup()
    expect(formWrapper).toBeInTheDocument()
  })

  it('renders login info form fields', async () => {
    const { getByTestId } = await setup()
    expect(getByTestId('user-name-input')).toBeInTheDocument()
    expect(getByTestId('current-password-input')).toBeInTheDocument()
    expect(getByTestId('new-password-input')).toBeInTheDocument()
  })

  describe('Login info form - Username field validations', () => {
    it('Should populate initial value', async () => {
      const { getByTestId } = await setup()
      const input = getByTestId('user-name-input')
      expect(input.value).toBe('user name')
    })

    it('User name Should have at least min 6 characters', async () => {
      const { getByTestId } = await setup()
      const input = getByTestId('user-name-input')
      fireEvent.change(input, { target: { value: '1234567' } })
      expect(input.value).toBe('1234567')
    })

    it('User name should throw error if its less then 6 characters', async () => {
      const { getByText, getByTestId } = await setup()
      const input = getByTestId('user-name-input')
      fireEvent.change(input, { target: { value: '12345' } })
      fireEvent.focusOut(input)
      expect(
        getByText('The username must be at least 6 characters')
      ).toBeInTheDocument()
    })

    it('User name Should show error if empty', async () => {
      const { getByTestId, getByText } = await setup()
      const input = getByTestId('user-name-input')
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.focusOut(input)
      expect(getByText('Please enter user name')).toBeInTheDocument()
    })

    it('Current password should be empty', async () => {
      const { getByTestId } = await setup()
      const input = getByTestId('current-password-input')
      expect(input.value).toBe('')
    })

    it('New password should be empty', async () => {
      const { getByTestId } = await setup()
      const input = getByTestId('new-password-input')
      expect(input.value).toBe('')
    })

    it('New password Should show error if current password is entered', async () => {
      const { getByTestId, getByText } = await setup()
      const currentInput = getByTestId('current-password-input')
      fireEvent.change(currentInput, { target: { value: 'current' } })
      const newInput = getByTestId('new-password-input')
      expect(newInput.value).toBe('')
      fireEvent.focusOut(newInput)
      expect(getByText('Please enter new password')).toBeInTheDocument()
    })

    it('Current password Should show error if its empty and new password is not empty', async () => {
      const { getByTestId, getByText } = await setup()
      const input = getByTestId('new-password-input')
      fireEvent.change(input, { target: { value: 'newPassword' } })
      const currentInput = getByTestId('current-password-input')
      expect(currentInput.value).toBe('')
      fireEvent.focusOut(currentInput)
      expect(getByText('Please enter current password')).toBeInTheDocument()
    })
  })

  test('Click on check availability for user name and display message if username is same', async () => {
    const { getByText, getByTestId } = await setup()

    const input = getByTestId('user-name-input')
    fireEvent.change(input, { target: { value: 'user name' } })

    fireEvent.click(getByTestId('check-availability'))
    expect(document.domain).not.toEqual('.insight.com')
    expect(getByText('Current username')).toBeInTheDocument()
  })

  test('Click on Save checks if username is same then display message without triggering API', async () => {
    const { getByTestId, getByText } = await setup()

    const newInput = getByTestId('new-password-input')
    expect(newInput.value).toBe('')
    const currentInput = getByTestId('current-password-input')
    expect(currentInput.value).toBe('')

    const input = getByTestId('user-name-input')
    fireEvent.change(input, { target: { value: 'user name' } })
    expect(input.value).toEqual('user name')

    fireEvent.click(getByTestId('login-info-save-btn'))
    expect(getByText('Current username')).toBeInTheDocument()
  })

  test('Click on Save checks if username is different and passwords are empty, then update username', async () => {
    const { onSubmit, getByTestId, queryByTestId } = await setup()

    const input = getByTestId('user-name-input')
    fireEvent.change(input, { target: { value: 'amoorthi10' } })

    const currentInput = getByTestId('current-password-input')
    expect(currentInput.value).toBe('')

    const newInput = getByTestId('new-password-input')
    expect(newInput.value).toBe('')

    fireEvent.click(getByTestId('login-info-save-btn'))
    await waitFor(() => {
      expect(onSubmit).toBeCalledTimes(1)
    })
  })

  test('Should submit username & password on save', async () => {
    const { getByTestId, queryByTestId, onSubmit } = await setup()

    const input = getByTestId('user-name-input')
    fireEvent.change(input, { target: { value: 'amoorthi10' } })

    const currentInput = getByTestId('current-password-input')
    fireEvent.change(currentInput, { target: { value: 'Insight1!' } })

    const newInput = getByTestId('new-password-input')
    fireEvent.change(newInput, { target: { value: 'Insight2!' } })

    fireEvent.click(getByTestId('login-info-save-btn'))
    await waitFor(() => {
      expect(onSubmit).toBeCalledTimes(1)
    })
  })
})
