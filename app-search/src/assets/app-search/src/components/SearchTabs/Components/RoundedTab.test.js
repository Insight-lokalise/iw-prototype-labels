import React from 'react'
import { render } from '@testing-library/react'
import RoundedTab from './RoundedTab'

const setup = async ({ isSelected }) => {
  const wrapper = render(
    <RoundedTab isSelected={isSelected} disabled onClick={() => {}} />
  )
  return {
    ...wrapper,
  }
}

describe('RoundedTab component', () => {
  it('applies selected class when isSelected is true', async () => {
    const { container } = await setup({ isSelected: true })
    expect(container.querySelector('.is-selected')).toBeTruthy()
  })
})
