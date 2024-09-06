import React from 'react'
import { render, waitFor, fireEvent } from 'test-utils'
import userEvent from '@testing-library/user-event';
import { InvoicesPage } from './InvoicesPage'
import {InvoiceContextProvider} from "../../context/InvoiceContext";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string),
  l: 'en_US'
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

const setup = async () => {
  const wrapper = render(
    <InvoiceContextProvider>
      <InvoicesPage />
    </InvoiceContextProvider>
  )
  return {...wrapper}
}

describe('Invoices History render Search Results', () => {
  it('Render components for Search Results', async () => {
    const { queryByTestId, queryByText } = await setup();
    
    await waitFor(() => {
      //render Resource Filters
      expect(queryByTestId('recordsPerPage')).toBeInTheDocument()
      expect(queryByTestId('sortBy')).toBeInTheDocument()
      expect(queryByText('Ascending')).toBeInTheDocument()
      expect(queryByText('Descending')).toBeInTheDocument()

      //render Resource Table
      const resourceTable = queryByTestId('invoices-container').querySelector('.c-resource-table')
      expect(resourceTable).toBeInTheDocument()
      expect(resourceTable.querySelector('.c-resource-table__header')).toBeInTheDocument()
      expect(resourceTable.querySelectorAll('.c-resource-table__accordion .c-accordion__item').length).toEqual(3)

      //render Pagination
      const pagination = queryByTestId('invoices-container').querySelector('.c-pagination')
      expect(pagination).toBeInTheDocument()
      expect(pagination.querySelectorAll('.c-pagination__page-number').length).toEqual(1)
      expect(queryByTestId('pagination-prev')).toBeInTheDocument()
      expect(queryByTestId('pagination-next')).toBeInTheDocument()
    })
  })
  it('Clear Search filters', async () => {
    const { getByRole, queryByTestId, queryByText, getByLabelText } = await setup();

    const input = getByRole('textbox', { name: /Search invoices/i })
    const fromDate = getByRole('textbox', { name: /From/i })
    const toDate = getByRole('textbox', { name: /To/i })
    fireEvent.change(input, { target: { value: '0219320941' } })
    fireEvent.change(fromDate, { target: { value: '09-Mar-2022' } })
    fireEvent.change(toDate, { target: { value: '09-Mar-2022' } })
    
    await waitFor(() => {
      expect(queryByTestId('recordsPerPage').value).toEqual('5')
      expect(queryByTestId('sortBy').value).toEqual('1')
      expect(queryByTestId('invoices-container').querySelector('#sort_asc').checked).toEqual(false)
      
      //change sorting options
      fireEvent.click(queryByText('Ascending'))
      userEvent.selectOptions(queryByTestId('recordsPerPage'), '20')
      userEvent.selectOptions(queryByTestId('sortBy'), '2')
      fireEvent.click(getByLabelText('Ascending'))

      //clear search
      fireEvent.click(queryByText("Clear search"))

      //empty search fields
      expect(input.value).toEqual('')
      expect(fromDate.value).toEqual('')
      expect(toDate.value).toEqual('')    

      //keep sorting option changes on clear
      expect(queryByTestId('recordsPerPage').value).toEqual('20')
      expect(queryByTestId('sortBy').value).toEqual('2')
      expect(queryByTestId('invoices-container').querySelector('#sort_asc').checked).toEqual(true)
    })
  })
})
