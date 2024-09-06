import React from 'react'
import { mount } from 'enzyme'
import ProductDescription from '../../src/components/ProductDescription'

describe('ProductDescription', () => {

  /**
   * Verify that both the title and subtitle are rendered into a single <h1>
   * element, with a space between them.
   */
  test('it renders both title and subtitle', () => {
    const component = mount(<ProductDescription title="TITLE-1" subtitle="SUBTITLE-1" />)
    const h1 = component.find('h1')
    expect(h1.text()).toEqual('TITLE-1 SUBTITLE-1')
  })

  /**
   * Verify that the subtitle is optional.
   */
  test('it renders only title', () => {
    const component = mount(<ProductDescription title="TITLE-2" />)
    const h1 = component.find('h1')
    expect(h1.text()).toEqual('TITLE-2')
  })
})
