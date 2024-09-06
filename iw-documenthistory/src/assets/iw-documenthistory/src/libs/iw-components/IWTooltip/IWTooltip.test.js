import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import IWTooltip from './IWTooltip'

let wrapper

describe('IWTooltip', () => {
  beforeEach(() => {
    wrapper = render(<IWTooltip tooltip="IGNORE ME!">
      <div data-testid="tooltip-target">Hello!</div>
    </IWTooltip>)
  })
  afterEach(() => {
    wrapper.unmount()
    jest.clearAllMocks()
  })

  it('renders w/o crashing', () => {
    const {container, getByText} = wrapper
    expect(
      container.querySelector(".iw-tooltippy")
    ).toBeInTheDocument()
    expect(getByText('IGNORE ME!')).toBeInTheDocument()
  })
  it('defaults showIf to false', () => {
    const {container} = wrapper
    expect(
      container.querySelector(".hide")
    ).toBeInTheDocument()
  })
  it('handles mouse-over', () => {
    const {container, getByTestId} = wrapper
    fireEvent.mouseEnter(getByTestId('tooltip-target'))
    expect(
      container.querySelector(".hide")
    ).not.toBeInTheDocument()
    fireEvent.mouseLeave(getByTestId('tooltip-target'))
    expect(
      container.querySelector(".hide")
    ).toBeInTheDocument()
  })
  it('handles mouse click', () => {
    const {container, getByTestId} = wrapper
    fireEvent.click(getByTestId('tooltip-target'))
    expect(
      container.querySelector(".hide")
    ).not.toBeInTheDocument()
    fireEvent.click(getByTestId('tooltip-target'))
    expect(
      container.querySelector(".hide")
    ).toBeInTheDocument()
  })
})
