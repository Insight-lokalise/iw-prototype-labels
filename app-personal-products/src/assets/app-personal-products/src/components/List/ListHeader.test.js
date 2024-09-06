import React from 'react'
import { render } from '@testing-library/react'

import ListHeader from './ListHeader';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const setup = async () => {
  const wrapper = render(
    <ListHeader
      isBestPriceAvailable={false}
      isCOIAvailable
      isCSIAvailable={false}
      isReservedAvailable
      isAllValid={false}
      isInventorySearchEnabled
    />
  )

  return {
    ...wrapper
  }
}

describe('List Header', () => {
  it('renders the List Header', async () => {
    const { getByText } = await setup()
    expect(getByText('Actions')).toBeInTheDocument()
  })

})
