import React from 'react'
import { render } from '@testing-library/react'

import {IWHelpIcon} from './iw-helpIcon'

describe('IWHelpIcon', () => {
  it('renders w/ all components', () => {
    const {container, getByTestId, getByText} = render(<IWHelpIcon
      tooltip={(
        <div>
          <span data-testid="tooltip">HELP!</span>
        </div>
      )}
    />)
    expect(getByTestId('tooltip')).toBeInTheDocument()
    expect(getByText('HELP!')).toBeVisible()
    expect(container.querySelector('.ion-help-circled')).toBeInTheDocument()
  })
})
