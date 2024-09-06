import React from 'react'
import { render } from '@testing-library/react'
import {DefaultCardView} from './DefaultCardView'

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

describe('<DefaultCardView>', () => {
  it('Render default card view', () => {
    const { container, getByText } = render(
      <DefaultCardView
        type={"VISA"}
        lastFourDigits={1234}
      />
    )
    expect(getByText('Default')).toBeInTheDocument();
    expect(container.querySelector('.icon-cards--VISA')).toBeInTheDocument();
    expect(getByText('ending in 1234')).toBeInTheDocument();
  })
})
