import React from 'react'
import { render } from '@testing-library/react'
import Quantity from './Quantity';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const setup = async ({ isUnlimitedStock }) => {
  const wrapper = render(
    <Quantity
      stock={250}
      quantity='50'
      handleQuantityChange={() => { }}
      isUnlimitedStock={isUnlimitedStock}
    />)

  return {
    ...wrapper
  }
}

describe('Quantity', () => {
  it('renders the Quantity Detail when the unlimited stock is present ', async () => {
    const { getByText } = await setup({ isUnlimitedStock: true })
    expect(getByText('Unlimited availability')).toBeInTheDocument()
  })
})

describe('Quantity', () => {
  it('renders the Quantity Detail when the unlimited stock is not Present ', async () => {
    const { getByTestId } = await setup({ isUnlimitedStock: false })
    expect(getByTestId('stockIsLimited')).toBeInTheDocument()
  })
})