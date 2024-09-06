import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '../../../__tests__/test-utils'
import CartSummarySimpleView from './CartSummarySimpleView'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const setup = async ({ hasOutOfStockItems, hasQtyExceedsStockCartItems, showSaveForLater}) => {

  const wrapper = render(
    <CartSummarySimpleView
        hasOutOfStockItems={hasOutOfStockItems}
        hasQtyExceedsStockCartItems={hasQtyExceedsStockCartItems}
        showSaveForLater={showSaveForLater}
        ewrFeeAmount={0}
        shippingCost={0}
        taxCost={0}
        cart={{subTotal: 0, currency: 'USD'}}
      />)

  return {
    ...wrapper
  }
}

describe('CartSummarySimpleView', () => {
  test('Show Save as quote link', async () => {
    const { getByText } = await setup({ hasOutOfStockItems: false, hasQtyExceedsStockCartItems: false, showSaveForLater: true});
    expect(getByText("Save as quote")).toBeInTheDocument()
  })

  test('Hide Show Save as quote link', async () => {
    const { queryByText } = await setup({ showSaveForLater: false});
    expect(queryByText("Save as quote")).not.toBeInTheDocument()
  })

  test('Show Save as quote link if there are out of stock items', async () => {
    const { getByText, getByTestId } = await setup({ hasOutOfStockItems: true, hasQtyExceedsStockCartItems: false, showSaveForLater: true});
    const saveQuote = getByTestId('save-quote')
    expect(getByText("Save as quote")).toBeInTheDocument()
  })

  test('Show Save as quote link if the quantity exceeds stock', async () => {
    const { getByText, getByTestId } = await setup({ hasOutOfStockItems: false, hasQtyExceedsStockCartItems: true, showSaveForLater: true});
    const saveQuote = getByTestId('save-quote')
    expect(getByText("Save as quote")).toBeInTheDocument()
  })
})
