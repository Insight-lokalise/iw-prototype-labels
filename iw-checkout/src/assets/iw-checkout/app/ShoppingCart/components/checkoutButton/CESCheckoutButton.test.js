import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CESCheckoutButtonView from './CESCheckoutButtonView'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const setup = async ({ isLoading }) => {
  const proceedToQuickCheckout = jest.fn()
  const wrapper = render(
    <CESCheckoutButtonView
      isLoading={isLoading}
      quickCheckout={true}
      proceedToQuickCheckout={proceedToQuickCheckout}
    />)

  return {
    ...wrapper
  }
}

describe('CESCheckoutButtonView', () => {
  test('Display checkout button enabled', async () => {
    const { getByText, getByTestId } = await setup({isLoading: false});
    expect(getByTestId('quickcheckout').disabled).toEqual(false)
    expect(getByText("Quick checkout")).toBeInTheDocument()
  })

  test('Display checkout button disabled', async () => {
    const { getByTestId, getByText } = await setup({isLoading: true});
    expect(getByText("Quick checkout")).toBeInTheDocument()
    fireEvent.click(getByTestId("quickcheckout"))
    expect(getByTestId('quickcheckout').disabled).toEqual(true)
  })
})
