import React from 'react';
import { render } from '@testing-library/react';
import DetailsView from "./DetailsView";

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const cartObj = {
  additionalInformation: [],
  billingAddress: [],
  shippingOptions: [],
  contracts: [],
  shippingAddress: []
}

const setup = async ({cart, className, hasFailed, isLoading, type}) => {
  const wrapper = render(
    <DetailsView cart={cart} className={className} hasFailed={hasFailed}
                 isLoading={isLoading} type={type}/>
  )
  return {
    ...wrapper
  }
}

describe('DetailsView Component', () => {
  it('Should render loading', async () => {
    const {getByTestId} = await setup({cart: cartObj, className: '', hasFailed: false, isLoading: true, type: 'orders'});
    expect(getByTestId('details-view-loading')).toBeInTheDocument();
  })
})

describe('DetailsView Component', () => {
  it('Should render the Failed text when hasFailed is true', async () => {
    const {getByTestId} = await setup({cart: cartObj, className: '', hasFailed: true, isLoading: false, type: 'orders'});
    expect(getByTestId('details-view-failed')).toBeInTheDocument();
  })
})

describe('DetailsView Component', () => {
  it('Should render the DetailsView Component', async () => {
    const {getByTestId} = await setup({cart: cartObj, className: '', hasFailed: false, isLoading: false, type: 'orders'});
    expect(getByTestId('details-view')).toBeInTheDocument();
  })
})


