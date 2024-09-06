import React from 'react'
import { render, waitFor, fireEvent } from 'test-utils'
import { QuotesPage } from './QuotesPage'
import {QuotesContextProvider} from "../../context/QuotesContext";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

jest.mock('app-api-user-service', ()=>{return {
  getUserInformation: jest.fn(() =>
    Promise.resolve({ data: {
      isLoggedIn: true,
      userInformation: {
        account: 123456
      }
    } })
  )
}}, {virtual: true})

const  setup = async () => {
  const wrapper = render(
    <QuotesContextProvider>
      <QuotesPage />
    </QuotesContextProvider>
  )
  return {...wrapper}
}

describe('Quotes History initial render', () => {
  it('Render components for Top 5 Quotes', async () => {
    const { getByText, getByTestId, queryByTestId, queryByText } = await setup()

    const searchPane = getByTestId('quotes-container').querySelector('.c-panel .c-search-pane')

    //render Search Pane
    expect(searchPane).toBeInTheDocument()
    expect(searchPane.querySelectorAll('input').length).toEqual(3)
    expect(searchPane.querySelector('svg')).toBeInTheDocument()
    expect(getByText('Clear search')).toBeInTheDocument()
    expect(getByText('Search quotes')).toBeInTheDocument()
    expect(getByText('From')).toBeInTheDocument()
    expect(getByText('To')).toBeInTheDocument()

    await waitFor(() => {
      //don't render Resource Filters
      expect(queryByTestId('recordsPerPage')).not.toBeInTheDocument()
      expect(queryByTestId('sortBy')).not.toBeInTheDocument()
      expect(queryByText('Ascending')).not.toBeInTheDocument()
      expect(queryByText('Descending')).not.toBeInTheDocument()

      //render Resource Table
      const resourceTable = queryByTestId('quotes-container').querySelector('.c-resource-table')
      expect(resourceTable).toBeInTheDocument()
      expect(resourceTable.querySelector('.c-resource-table__header')).toBeInTheDocument()
      expect(resourceTable.querySelectorAll('.c-resource-table__accordion .c-accordion__item').length).toEqual(2)

      //render Pagination
      const pagination = queryByTestId('quotes-container').querySelector('.c-pagination')
      expect(pagination).toBeInTheDocument()
      expect(pagination.querySelectorAll('.c-pagination__page-number').length).toEqual(1)
      expect(queryByTestId('pagination-prev')).toBeInTheDocument()
      expect(queryByTestId('pagination-next')).toBeInTheDocument()
    })
  })
})

describe('Quotes History render Search Results', () => {
  it('Clear Search filters', async () => {
    const { getByRole, queryByTestId, queryByText, debug } = await setup();

    const input = getByRole('textbox', { name: /Search quotes/i })
    const fromDate = getByRole('textbox', { name: /From/i })
    const toDate = getByRole('textbox', { name: /To/i })
    fireEvent.change(input, { target: { value: '0219320941' } })
    fireEvent.change(fromDate, { target: { value: '09-Mar-2022' } })
    fireEvent.change(toDate, { target: { value: '09-Mar-2022' } })

    await waitFor(() => {
      //clear search
      fireEvent.click(queryByText("Clear search"))

      //empty search fields
      expect(input.value).toEqual('')
      expect(fromDate.value).toEqual('')
      expect(toDate.value).toEqual('')

      //hide sorting options since top 5 quotes are shown
      expect(queryByTestId('recordsPerPage')).not.toBeInTheDocument()
      expect(queryByTestId('sortBy')).not.toBeInTheDocument()
      expect(queryByText('Ascending')).not.toBeInTheDocument()
      expect(queryByText('Descending')).not.toBeInTheDocument()
    })
  })
})
