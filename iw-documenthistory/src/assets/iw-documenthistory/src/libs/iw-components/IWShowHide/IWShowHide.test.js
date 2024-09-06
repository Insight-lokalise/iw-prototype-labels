import React from 'react'
import { render } from '@testing-library/react'

import { IWShowHide } from './IWShowHide'

let wrapper

describe('IWShowHide', () => {
  afterEach(() => {
    wrapper.unmount()
  })
  it('displays children', () => {
    wrapper = render(
      <IWShowHide showIf={true}>
        <span data-testid="children"/>
      </IWShowHide>
    )
    const {container, getByTestId} = wrapper
    expect(container.querySelector('.hide')).not.toBeInTheDocument()
    expect(getByTestId('children')).toBeInTheDocument()
  })
  it('hides children', () => {
    wrapper = render(
      <IWShowHide showIf={false}>
        <span data-testid="children"/>
      </IWShowHide>
    )
    const {container, getByTestId} = wrapper
    expect(container.querySelector('.hide')).toBeInTheDocument()
    expect(getByTestId('children')).toBeInTheDocument()
  })
})
