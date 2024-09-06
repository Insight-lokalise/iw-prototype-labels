import React from 'react'

import { render, fireEvent } from '@testing-library/react'
import IWModal from './IWModal'
import { t } from '@insight/toolkit-utils/lib/labels'
jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})


describe('<IWModal>', () => {
  const requiredProps = {
    backdropClassName: 'test__modal--backdrop',
    onHide: () => {},
    showIf: true
  }

  it('Should render with all correct sections', () => {
    const {container, queryByText} = render(<IWModal cancelBtnText="Cancel Button" {...requiredProps} />)
    expect(queryByText("Cancel Button")).toBeInTheDocument()
  })

  it('Should render without the header', () => {
    const {container} = render(<IWModal hideHeader={true} {...requiredProps} />)
    expect(container.querySelector('header')).not.toBeInTheDocument()
  })

  it('Should render the footer without the confirm button', () => {
    const {queryByText} = render(<IWModal hideConfirmBtn={true} {...requiredProps} confirmBtnText="submit"/>)
    expect(queryByText("submit")).not.toBeInTheDocument()
  })

  it('Should attempt to close the modal', () => {
    const onHide = jest.fn()
    const {getByTestId} = render(<IWModal {...requiredProps} onHide={onHide} />)
    fireEvent.click(getByTestId('modal-icon-close'))
    expect(onHide).toHaveBeenCalled()
  })
})
