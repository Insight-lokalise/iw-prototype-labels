import React from 'react'
import { render } from '@testing-library/react'

import ProductCompare from './ProductCompareView'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))


const setup = async ({ isSelectedToCompare, needsCompareTo }) => {
  const addToCompareProps = {
    isSelectedToCompare: isSelectedToCompare,
    needsCompareTo: needsCompareTo,
    toggleSelectToCompare: () => { }
  }
  const wrapper = render(
    <ProductCompare
      addToCompareProps={addToCompareProps}
      materialId='F56789'
    />)

  return {
    ...wrapper
  }
}

describe('ProductCompare', () => {
  it('renders the product part when product is selected to compare', async () => {
    const { getByTestId } = await setup({ isSelectedToCompare: true, needsCompareTo: true })
    expect(getByTestId('compare-text')).toBeInTheDocument()
  })
})

describe('ProductCompare', () => {
  it('renders the product part when product is not selected to compare', async () => {
    const { getByText } = await setup({ isSelectedToCompare: false, needsCompareTo: false })
    expect(getByText('Add to compare list')).toBeInTheDocument()
  })
})

