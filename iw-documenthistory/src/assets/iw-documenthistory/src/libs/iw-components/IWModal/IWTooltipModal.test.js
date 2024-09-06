import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import IWTooltipModal from './IWTooltipModal'

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{
  return {
    t: jest.fn(string => string)
  }
})

describe('<IWTooltipModal>', () => {
  const requiredProps = {
    modalBody: (
      <div data-testid="modal-body">
        <span>Modal Tooltip Test</span>
      </div>
    ),
    title: 'Modal Tooltip Test',
  }

  it('Should render', () => {
    const {queryByTestId, container} = render(<IWTooltipModal {...requiredProps} />)
    expect(container.querySelector('.ion-help-circled')).toBeInTheDocument()
    expect(queryByTestId("modal-body")).not.toBeInTheDocument()
  })

  it('Should open onClick', () => {
    const {getByTestId, container} = render(<IWTooltipModal {...requiredProps} />)
    fireEvent.click(container.querySelector('.ion-help-circled'))
    expect(getByTestId("modal-body")).toBeInTheDocument()
  })
})
