import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { t } from '@insight/toolkit-utils/lib/labels'
import IWModalLink from './IWModalLink'

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{
  return {
    t: jest.fn(string => string)
  }
})

describe('<IWModalLink>', () => {
  const requiredProps = {
    linkMarkup: <div data-testid="link">Modal Link Test</div>,
    modalBody: <div className="modal-body" data-testid="modal-body"/>,
    modalTitle: 'Modal Link Title',
    onConfirm: () => {},
  }

  it('Should render', () => {
    const {queryByTestId} = render(<IWModalLink {...requiredProps} />)
    expect(queryByTestId("link")).toBeInTheDocument()
    expect(queryByTestId("modal-body")).not.toBeInTheDocument()
  })

  it('Should open on click', () => {
    const {queryByTestId} = render(<IWModalLink {...requiredProps} />)
    fireEvent.click(queryByTestId('link'))
    expect(queryByTestId("modal-body")).toBeInTheDocument()
  })
})
