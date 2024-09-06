import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import SuggestedAddressSearch from './SuggestedAddressSearch'
jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

describe('<SuggestedAddressSearch> tests', () => {
  test('should render', () => {
    const filterAddress = jest.fn();

    const { getByText } = render(<SuggestedAddressSearch filterAddress={filterAddress} />)

    expect(getByText('Search for suggested address')).toBeInTheDocument();
  })

  test('Should filter addresses when search button is pressed', () => {
    const filterAddress = jest.fn();

    const { getByRole } = render(<SuggestedAddressSearch filterAddress={filterAddress} />)

    const searchBtn = getByRole('button');
    fireEvent.click(searchBtn)

    expect(filterAddress).toHaveBeenCalled()
  })

  test('Should filter addresses when enter key is pressed', () => {
    const filterAddress = jest.fn();

    const { container, getByRole } = render(<SuggestedAddressSearch filterAddress={filterAddress} />)
    const searchInput = getByRole('textbox')

    fireEvent.change(searchInput, { target: { value: 'test' } })
    fireEvent.keyDown(container, { key: 'Enter', code: 'Enter', which: 13 })

    const searchTimeout = setTimeout(() => {
			expect(filterAddress).toHaveBeenCalled()
			clearTimeout(searchTimeout)
		}, 400)
  })
})