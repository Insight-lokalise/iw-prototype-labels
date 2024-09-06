import React from 'react'
import { render } from 'test-utils'
import { QuoteDetailsHeader } from "./QuoteDetailsHeader";

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

const setup = async ({ quoteId,
                       quoteName,
                       quoteReferenceNumber,
                       quoteCreatedDate,
                       quoteExpirationDate,
                       accountNumber,
                       accountName,
                       isExpired }) => {
  const wrapper = render(
    <QuoteDetailsHeader
       quoteId={quoteId}
       quoteName={quoteName}
       quoteReferenceNumber={quoteReferenceNumber}
       quoteCreatedDate={quoteCreatedDate}
       quoteExpirationDate={quoteExpirationDate}
       accountNumber={accountNumber}
       accountName={accountName}
       isExpired={isExpired}
    />
  )
  return {...wrapper}
}

describe('Quote details header Information', () => {

  it('renders quote detail heading and no expiry date', async () => {
    const { getByText, getByTestId } = await setup({
      quoteId :'1',
      isExpired: false
    })
    expect(getByText('Quote details')).toBeInTheDocument()
    expect(getByTestId('quoteNum')).toBeInTheDocument();
  })

  it('renders quote detail heading with expiry date if the quote is expired', async () => {
    const { getByText, getByTestId } = await setup({
      quoteId :'1',
      quoteCreatedDate: '12/01/2021',
      quoteExpirationDate: '09/01/2019',
      isExpired: true
    })
    expect(getByText('Quote details')).toBeInTheDocument()
    expect(getByTestId('quoteNum')).toBeInTheDocument();
    expect(getByTestId('expired')).toBeInTheDocument();
  })

  // it('renders email and print links', async () => {
  //   const { getByTestId } = await setup({ quoteId :'1'})
  //   expect(getByTestId('send-email')).toBeInTheDocument()
  //   expect(getByTestId('print')).toBeInTheDocument();
  // })

  it('renders quote header information', async () => {
    const { getByTestId } = await setup(
      {
        quoteId: '1',
        quoteName: 'Quote name example 1',
        quoteReferenceNumber: '52306564',
        quoteCreatedDate: '12/01/2021',
        quoteExpirationDate: '01/31/2022',
        accountNumber: '10285059',
        accountName: 'Account name',
        isExpired: false
      })
    expect(getByTestId('quote-name')).toBeInTheDocument()
    expect(getByTestId('ref-number')).toBeInTheDocument();
    expect(getByTestId('quote-creation')).toBeInTheDocument()
    expect(getByTestId('acct-number')).toBeInTheDocument();
    expect(getByTestId('quote-expiration')).toBeInTheDocument()
    expect(getByTestId('acct-name')).toBeInTheDocument();
  })

})
