import React from 'react'
import { cleanup, render, screen , within} from '@testing-library/react'
import { IWAddress } from './IWAddress'

let wrapper
const address = {
  address1: 'address1',
  address2: 'address2',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  countryId: 'countryId',
}

describe('IWAddress', () => {

  afterEach(() => {
    cleanup()
  })

  it('renders with full address', () => {
    const { asFragment } = render(<IWAddress address={address} className="rendered" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders w/o address1', () => {
    const { asFragment } = render(<IWAddress address={{...address, address1: undefined}} className="rendered" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders w/o address2', () => {
    const { asFragment } = render(<IWAddress address={{...address, address2: undefined}} className="rendered" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders w/o city', () => {
    const { asFragment } = render(<IWAddress address={{...address, city: undefined}} className="rendered" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders w/o state', () => {
    const { asFragment } = render(<IWAddress address={{...address, state: undefined}} className="rendered" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders w/o zipCode', () => {
    const { asFragment } = render(<IWAddress address={{...address, zipCode: undefined}} className="rendered" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders w/o countryId', () => {
    const { asFragment } = render(<IWAddress address={{...address, countryId: undefined}} className="rendered" />)
    expect(asFragment()).toMatchSnapshot()
  })
})
