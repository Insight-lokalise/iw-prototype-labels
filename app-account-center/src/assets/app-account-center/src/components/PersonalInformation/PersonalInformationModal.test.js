import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PersonalInformationModal from './PersonalInformationModal'

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
  const setEmailAvailabilityStatus = jest.fn()
  const info = {
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1111111111',
  }
  const wrapper = render(
    <PersonalInformationModal
      isOpen={true}
      info={info}
      onSubmit={onSubmit}
      onClose={onClose}
      setEmailAvailabilityStatus={setEmailAvailabilityStatus}
      emailAvailabilityStatus="unavailable"
    />
  )
  const formWrapper = wrapper.getByTestId('personal-info-form')
  return {
    onSubmit,
    formWrapper,
    ...wrapper,
  }
}

describe('PersonalInformation editable form', () => {
  it('renders personal info editable form when clicked on edit button', async () => {
    const { formWrapper } = await setup()
    expect(formWrapper).toBeInTheDocument()
  })

  it('renders personal info form fields', async () => {
    const { getByText, getByTestId } = await setup()
    expect(getByText('First name')).toBeInTheDocument()
    expect(getByTestId('first-name-input')).toBeInTheDocument()
    expect(getByTestId('last-name-input')).toBeInTheDocument()
    expect(getByTestId('email-input')).toBeInTheDocument()
    expect(getByTestId('phone-number-input')).toBeInTheDocument()
  })

  describe('personal info form - first name field validations', () => {
    it('Should populate initial value', async () => {
      const { getByTestId } = await setup()
      const input = getByTestId('first-name-input')
      expect(input.value).toBe('John')
    })

    it('First name Should accept max 40 characters', async () => {
      const { getByTestId } = await setup()
      const input = getByTestId('first-name-input')
      fireEvent.change(input, {
        target: { value: '1234567890123456789012345678901234567890' },
      })
      expect(input.value).toBe('1234567890123456789012345678901234567890')
      userEvent.type(input, '123456789012345678901234567890123456789012345')
      expect(input.value).toBe('1234567890123456789012345678901234567890')
    })

    it('First name Should show error if empty', async () => {
      const { getByTestId, getByText } = await setup()
      const input = getByTestId('first-name-input')
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.focusOut(input)
      expect(getByText('Please enter first name')).toBeInTheDocument()
    })

    it('Last name Should accept max 40 characters', async () => {
      const { getByTestId } = await setup()
      const input = getByTestId('last-name-input')
      fireEvent.change(input, {
        target: { value: '1234567890123456789012345678901234567890' },
      })
      expect(input.value).toBe('1234567890123456789012345678901234567890')
      userEvent.type(input, '123456789012345678901234567890123456789012345')
      expect(input.value).toBe('1234567890123456789012345678901234567890')
    })

    it('Last name Should show error if empty', async () => {
      const { getByTestId, getByText } = await setup()
      const input = getByTestId('last-name-input')
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.focusOut(input)
      expect(getByText('Please enter last name')).toBeInTheDocument()
    })

    it('Email Should accept - , _', async () => {
      const { getByTestId, queryByText } = await setup()
      const input = getByTestId('email-input')
      fireEvent.change(input, { target: { value: '' } })
      userEvent.type(input, 'test-test@test.com')
      expect(queryByText('Please enter a valid email address')).toBeNull()
    })

    it('Email Should only accept email, not to be empty', async () => {
      const { getByTestId, queryByText } = await setup()
      const input = getByTestId('email-input')
      fireEvent.change(input, { target: { value: '' } })
      userEvent.type(input, 'test-test.com')
      fireEvent.focusOut(input)
      expect(
        queryByText('Please enter a valid email address')
      ).toBeInTheDocument()
      fireEvent.change(input, { target: { value: '' } })
      userEvent.type(input, 'test-test@insight.com')
      fireEvent.focusOut(input)
      expect(queryByText('Please enter a valid email address')).toBeNull()
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.focusOut(input)
      expect(
        queryByText('Please enter a valid email address')
      ).toBeInTheDocument()
    })

    it('Phone number Should show error if empty', async () => {
      const { getByTestId, getByText } = await setup()
      const input = getByTestId('phone-number-input')
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.focusOut(input)
      expect(getByText('Please enter phone number')).toBeInTheDocument()
    })

    it('Should submit on save', async () => {
      const { getByTestId, onSubmit } = await setup()
      fireEvent.click(getByTestId('personal-info-save-btn'))
      await waitFor(() => {
        expect(onSubmit).toBeCalledTimes(1)
      })
    })

    it('Email unavailable test', async () => {
      const { queryByText } = await setup()
      expect(queryByText('Email address is unavailable')).toBeInTheDocument()
    })
  })
})
