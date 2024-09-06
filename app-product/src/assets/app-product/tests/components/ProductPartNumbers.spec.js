import React from 'react'
import { mount } from 'enzyme'
import ProductPartNumbers from '../../src/components/ProductPartNumbers'

describe('ProductPartNumbers', () => {

  /**
   * Verify that all three values are rendered when provided, in the correct
   * order: insight number, manufacturer number, then unspsc number.
   */
  test('it renders all three values', () => {
    const component = mount(
      <ProductPartNumbers
        insightNumber="INSIGHT-1"
        manufacturerNumber="MANUFACTURER-1"
        unspscNumber="UNSPSC-1"
      />
    )

    const elements = component.find('.c-structured-list__description')
    expect(elements).toHaveLength(3)
    expect(elements.at(0).text()).toEqual('INSIGHT-1')
    expect(elements.at(1).text()).toEqual('MANUFACTURER-1')
    expect(elements.at(2).text()).toEqual('UNSPSC-1')
  })

  /**
   * Verify that the manufacturer number and unspsc number elements are not
   * rendered when no values are provided.
   */
  test('it renders only provided values', () => {
    const component = mount(
      <ProductPartNumbers
        insightNumber="INSIGHT-2"
      />
    )

    const elements = component.find('.c-structured-list__description')
    expect(elements).toHaveLength(1)
    expect(elements.at(0).text()).toEqual('INSIGHT-2')
  })
})
