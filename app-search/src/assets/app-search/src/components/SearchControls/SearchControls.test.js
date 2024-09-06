import React from 'react'
import { render } from '@testing-library/react'
import SearchControls from './SearchControls'
import {
  ILISTVIEW,
  PAGECOUNTPRODUCTOPTIONS,
  SORTOPTIONS,
} from '../../constants'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn((string) => string),
}))

const createDefaultProps = (props) => ({
  clearFilters: jest.fn(),
  selectedFilters: new Map(),
  setFilter: jest.fn(),
  setView: jest.fn(),
  toggleFilters: jest.fn(),
  view: ILISTVIEW.grid,
  ...props,
})

describe('<SearchControls />', () => {
  it('should render', () => {
    const props = createDefaultProps()
    const utils = render(<SearchControls {...props} />)

    for (const option of PAGECOUNTPRODUCTOPTIONS) {
      utils.getByText(option.text)
    }

    for (const option of SORTOPTIONS) {
      utils.getByText(option.text)
    }
  })
})
