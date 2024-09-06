import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'test-utils'

import IWSummary from './IWSummary'
import { t, l } from '@insight/toolkit-utils/lib/labels'

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{
  return {
    l: jest.fn(() => 'en_US'),
    t: jest.fn(string => string)
  }
})


let wrapper
const costProps = {
  subTotal: 10000,
  shippingCost: 1000,
  taxCost: 100,
  ewrFee: 10,
  pstTaxCost: 1,
  gstHstTaxCost: 0.1,
  isCanada: false,
}

describe('IWSummary', () => {
  describe('renders correctly', () => {
    afterEach(() => wrapper.unmount())

    it('renders something', () => {
      wrapper = render(<IWSummary {...costProps} showTax showEWR showPstTax showGstHstTax currency={'USD'} />)
      const { asFragment} = wrapper
      expect(asFragment()).toMatchSnapshot()
    })

    it('renders children', () => {
      wrapper = render(
        <IWSummary {...costProps} currency={'USD'}>
          <span data-testid="render-check" className="render-check" />
        </IWSummary>
      )
      const {queryByTestId} = wrapper
      expect(queryByTestId('render-check')).toBeInTheDocument()
    })

    it('renders blank tax', () => {
      wrapper = render(<IWSummary {...costProps} showTax showBlankTax currency={'USD'} />)
      const {queryByTestId} = wrapper
      expect(queryByTestId('empty-psttax')).toBeInTheDocument()
      expect(queryByTestId('empty-gsttax')).toBeInTheDocument()
    })

    it('renders carrierDescription', () => {
      wrapper = render(
        <IWSummary {...costProps} showCarrierDescription carrierDescription={'description'} currency={'USD'} />
      )
      const {getByText} = wrapper
      expect(getByText('(description)')).toBeInTheDocument()
    })

    it('handles 3rd party carriers:', () => {
      wrapper = render(<IWSummary {...costProps} usedThirdPartyCarrier currency={'USD'} />)
      const {getByText} = wrapper
      expect(getByText('Charge Account')).toBeInTheDocument()
    })
  })

  describe('calculates the correct displayed total', () => {
    afterEach(() => wrapper.unmount())

    it('excludes hidden values', () => {
      // only subTotal and shipping costs are included by default
      wrapper = render(<IWSummary {...costProps} currency={'USD'} />)
      const {getByText} = wrapper
      expect(getByText('$11,000.00')).toBeInTheDocument()
    })
  })
})
