import React from 'react'
import { render } from '@testing-library/react'

import ProductImage from './ProductImage';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const setup = async () => {
  const wrapper = render(<ProductImage
    imageURL='Apple MacBook Pro - 16.2" - M1 Pro - 16 GB RAM - 512 GB SSD - US'
    description='https://picsum.photos/seed/picsum/200/300'
  />)

  return {
    ...wrapper
  }
}

describe('Product Image', () => {
  it('renders the product image', async () => {
    const { getByTestId } = await setup()
    expect(getByTestId('productImage')).toBeInTheDocument()
  })

})
