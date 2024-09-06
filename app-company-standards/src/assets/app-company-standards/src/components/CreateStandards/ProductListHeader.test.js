import React from 'react';
import { render } from '@testing-library/react'
import ProductListHeader from './ProductListHeader';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))


const setup = async () => {
  const wrapper = render(
    <ProductListHeader
  />
)
  return {
    ...wrapper
  }
}

describe('Product List Header', () => {
  it('Should render the ProductListHeader', async () => {
    const { container, getByText } = await setup();
    expect(getByText('Configuration')).toBeInTheDocument();
    expect(container.getElementsByClassName('c-cs-product__list-header').length).toBe(1)
  })
})

