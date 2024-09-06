import React from 'react'
import { render } from 'test-utils'
import SearchProductPreview from './SearchProductPreview'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn((string) => string),
}))

const product = {
  description: 'R-Go HE Mouse Ergonomic Mouse',
  image:
    'https://cdn.cs.1worldsync.com/02/6c/026cdaaa-0097-4364-b2ff-15c5ab4748db.jpg',
  materialId: 'RGOHE',
  manufacturerName: 'ERGOGUYS LLC',
  manufacturerPartNumber: 'RGOHE',
  price: { webPrice: 259.66 },
  averageRating: 4,
}

const setup = async () => {
  const wrapper = render(<SearchProductPreview product={product} />)

  return {
    ...wrapper,
  }
}

describe('SearchProductPreview tests', () => {
  test('Render SearchProductPreview', async () => {
    const { getByText, getAllByText } = await setup()
    expect(getByText('R-Go HE Mouse Ergonomic Mouse')).toBeInTheDocument()
    expect(getAllByText('RGOHE').length).toEqual(2)
    expect(getByText('$259.66')).toBeInTheDocument()
  })
})
