import React from 'react'
import { render } from '@testing-library/react'
import {SearchFilter} from './SearchFilter'

const noop = () => {
  // Intentionally empty
}

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

describe('<SearchFilter />', () => {
  test('should render a pricing group with min max inputs', async () => {
    const { getByText, getByLabelText } = render(
      <SearchFilter
        toggleFilters={jest.fn()}
        facets={[
          {
            key: 'pricing',
            label: 'Pricing',
            type: 'price',
            buckets: [
              {
                label: '$0 - $749',
                val: 'lte=749',
                count: '2',
              },
              {
                label: '$750 - $1,249',
                val: 'gte=750&lte=1249',
                count: '3',
              },
              {
                label: '$1,250 - $1,999',
                val: 'gte=1250&lte=1999',
                count: '6',
              },
            ],
          },
        ]}
        clearFilters={noop}
        setFilter={noop}
        showFilters={false}
      />
    )
    getByText('Pricing')
    getByLabelText('Minimum')
    getByLabelText('Maximum')
  })

  test('should render a type group with notebook and chromebook filters', async () => {
    const { getByText } = render(
      <SearchFilter
        toggleFilters={jest.fn()}
        facets={[
          {
            name: 'type',
            label: 'Type',
            buckets: [
              {
                label: 'Notebook',
                value: 'notebook',
                count: '5',
              },
              {
                label: 'Chromebooks',
                value: 'chromebooks',
                count: '5',
              },
            ],
          },
        ]}
        clearFilters={noop}
        setFilter={noop}
        showFilters={false}
      />
    )
    getByText('Type')
    getByText('Notebook (5)')
    getByText('Chromebooks (5)')
  })

  test('should render an available quantity of two for 256 GB storage filter', async () => {
    const { getByText } = render(
      <SearchFilter
        toggleFilters={jest.fn()}
        facets={[
          {
            key: 'storage-capacity',
            label: 'Storage Capacity',
            buckets: [
              {
                label: '256 GB',
                val: '256gb',
                count: '2',
              },
            ],
          },
        ]}
        clearFilters={noop}
        setFilter={noop}
        showFilters={false}
      />
    )
    getByText('Storage Capacity')
    getByText('256 GB (2)')
  })
})
