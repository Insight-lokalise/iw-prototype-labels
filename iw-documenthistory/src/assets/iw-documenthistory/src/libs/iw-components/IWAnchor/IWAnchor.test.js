import React from 'react'
import { render } from '@testing-library/react'
import { IWAnchor } from './IWAnchor'

describe('<IWAnchor>', () => {
  it('should render children', () => {
    const {asFragment} = render(
      <IWAnchor className="B__E--M">
        Clickable
        <strong>text</strong>
      </IWAnchor>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
