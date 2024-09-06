import React from 'react'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react'

import IWInput from './IWInput'

describe('IWInput', () => {
  it('renders checkbox correctly', () => {
    const {asFragment} = render(<IWInput label="Testing" name="testing" type="checkbox" />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders textArea correctly', () => {
    const {asFragment} = render(<IWInput label="Testing" name="testing" type="textArea" />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders tel correctly', () => {
    const {asFragment} = render(<IWInput label="Testing" name="testing" type="tel" />)
    expect(asFragment()).toMatchSnapshot()
  })
})
