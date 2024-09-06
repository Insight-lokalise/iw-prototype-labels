import React from 'react'
import { render } from '@testing-library/react'
import { ProductListItem } from './ProductListItem'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn((string) => string),
}))

const cesProduct = {
  materialId: 'MK1A3LL/A',
  productClassName: 'c-product__design-layout-basic',
  description: 'Apple MacBook Pro - 16.2" - M1 Max - 32 GB RAM - 1 TB SSD - US',
  productImage:
    '"Apple MacBook Pro - 16.2" - M1 Max - 32 GB RAM - 1 TB SSD - US"',
  detailsLink:
    '/en_US/shop/product/MK1A3LL%2FA/APPLE/MK1A3LL%2FA/Apple-MacBook-Pro--162"--M1-Max--32-GB-RAM--1-TB-SSD--US/',
  lineLimit: 3,
  manufacturerPartNumber: '"MK1A3LL/A"',
  currencyCode: 'USD',
  listPrice: '2739.99',
  price: '2643.99',
  showListPrice: true,
  ctaLink:
    '/en_US/shop/product/MK1A3LL%2FA/APPLE/MK1A3LL%2FA/Apple-MacBook-Pro--162"--M1-Max--32-GB-RAM--1-TB-SSD--US/',
  ctaText: 'Buy now',
  buttonType: 'secondary',
  showMfrPart: true,
  showStock: 'true',
  locale: 'en_US',
  approxStockByAvailabilityMessage: 11,
  isCES: true,
}
const legacyProduct = {
  materialId: 'MK1A3LL/A',
  productClassName: 'c-product__design-layout-basic',
  description: 'Apple MacBook Pro - 16.2" - M1 Max - 32 GB RAM - 1 TB SSD - US',
  productImage:
    '"Apple MacBook Pro - 16.2" - M1 Max - 32 GB RAM - 1 TB SSD - US"',
  detailsLink:
    '/en_US/shop/product/MK1A3LL%2FA/APPLE/MK1A3LL%2FA/Apple-MacBook-Pro--162"--M1-Max--32-GB-RAM--1-TB-SSD--US/',
  lineLimit: 3,
  manufacturerPartNumber: '"MK1A3LL/A"',
  currencyCode: 'CAD',
  listPrice: '2739.99',
  price: '2643.99',
  showListPrice: true,
  ctaLink:
    '/en_US/shop/product/MK1A3LL%2FA/APPLE/MK1A3LL%2FA/Apple-MacBook-Pro--162"--M1-Max--32-GB-RAM--1-TB-SSD--US/',
  ctaText: 'Buy now',
  buttonType: 'secondary',
  showMfrPart: true,
  showStock: 'true',
  locale: 'en_US',
  availabilityMessage: '441 In-stock',
  isCES: false,
}
describe('ProductListItem', () => {
  it('renders CES product', async () => {
    const { getByText, getAllByText } = render(
      <ProductListItem product={cesProduct} />
    )
    expect(getByText(/In stock/i)).toBeInTheDocument()
    expect(getByText(/2,739.99/i)).toBeInTheDocument()
    expect(getByText(/2,643.99/i)).toBeInTheDocument()
    expect(getAllByText(/USD/i)).toHaveLength(2)
    expect(getByText(/Buy now/i)).toBeInTheDocument()
  })
  it('renders legacy product', async () => {
    const { getByText, getAllByText } = render(
      <ProductListItem product={legacyProduct} />
    )
    expect(getByText(/441 In-stock/i)).toBeInTheDocument()
    expect(getByText(/2,739.99/i)).toBeInTheDocument()
    expect(getByText(/2,643.99/i)).toBeInTheDocument()
    expect(getAllByText(/CAD/i)).toHaveLength(2)
    expect(getByText(/Buy now/i)).toBeInTheDocument()
  })
})
