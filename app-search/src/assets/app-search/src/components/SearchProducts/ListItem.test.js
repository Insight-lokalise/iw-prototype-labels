import React from 'react'
import ListItem from './ListItem'
import { ILISTVIEW } from '../../constants'
import { render } from 'test-utils'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn((string) => string),
}))

describe('<ListItem />', () => {
  test('should render a list item', async () => {
    const product = {
      searchProductId: '01AG877-NEW-SP!01AG877-NEW-SP',
      availability: 'AVAILABLE',
      availabilityMessage: 'Data not available',
      averageRating: 5.0,
      description: 'LENOVO - NEW LENOVO 16GB DDR4-3200',
      image:
        'https://cdn.cnetcontent.com/1c/89/1c89a05d-bf9d-4835-95e6-77a491718de1.jpg',
      insightPrice: '5434.71',
      listPrice: '6793.39',
      price: { webPrice: '5434.71', listPrice: '6793.39' },
      longDescription: 'LENOVO - NEW LENOVO 16GB DDR4-3200',
      manufacturerName: 'LENOVO',
      manufacturerPartNumber: '01AG877-NEW-SP',
      materialId: '01AG877-NEW-SP',
      reviewCount: 711.0,
      sku: '01AG877-NEW-SP',
      bullet1: null,
      bullet2: null,
      bullet3: null,
      bullet4: null,
      bullet5: null,
    }

    const setup = async () => {
      const wrapper = render(
        <ListItem product={product} view={ILISTVIEW.grid} />
      )

      return {
        ...wrapper,
      }
    }

    const { getByText, container } = await setup()

    expect(container.querySelector('.c-button--inline-link ').href).toEqual(
      'http://localhost/en_US/shop/product/01AG877-NEW-SP/lenovo/01AG877-NEW-SP/LENOVO-NEW-LENOVO-16GB-DDR43200/'
    )
    expect(getByText(product.description)).toBeInTheDocument()
  })
})
