import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import {TinyPagination} from './TinyPagination'

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

describe('TinyPagination', () => {
  test('should render correctly', () => {
    const onPageChange = jest.fn()
    const { getByText } = render(<TinyPagination currentPage={1} totalPages={100} pageHandler={onPageChange} />)

    expect(getByText(/Page 1/i)).toBeInTheDocument()
  })

test('should display proper page number', () => {
    const onPageChange = jest.fn()
    const { getByText } = render(<TinyPagination currentPage={3} totalPages={100} pageHandler={onPageChange} />)

    expect(getByText(/Page 3/i)).toBeInTheDocument()
  })
  test('should handle button press correctly', () => {
    const onPageChange = jest.fn()
    const { getAllByRole } = render(<TinyPagination currentPage={3} totalPages={100} pageHandler={onPageChange} />)

    const BUTTONS = getAllByRole('button')
    
    BUTTONS.forEach(btn => {
      fireEvent.click(btn)
    })

    expect(onPageChange).toHaveBeenCalledTimes(2)
  })
})
