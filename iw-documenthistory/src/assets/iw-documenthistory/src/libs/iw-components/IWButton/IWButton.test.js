import React from 'react'
import { render } from '@testing-library/react'

import { IWButton } from './IWButton'

describe('IWButton', () => {
  it('renders w/ children', () => {
    const {container, getByTestId, getByText} = render(
      <IWButton className="rendered" aria-label="label">
        <p data-testid="button-text">Button!</p>
      </IWButton>
    )
    expect(container.querySelector('.rendered')).toBeInTheDocument()
    expect(getByTestId('button-text')).toBeInTheDocument()
    expect(getByText('Button!')).toBeInTheDocument()
    const iwButton = container.querySelector('.rendered')
    expect(iwButton).toHaveAttribute('aria-label', 'label')
  })
  it('renders w/o children', () => {
    const {container, queryByTestId} = render(<IWButton className="rendered" />)
    expect(container.querySelector('.rendered')).toBeInTheDocument()
    expect(queryByTestId('button-text')).not.toBeInTheDocument()
  })
})
