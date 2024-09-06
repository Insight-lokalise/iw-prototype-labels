import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import { IWImage } from './../iw-image'

describe('IWImage', () => {
    it('should throw if alt-text is not provided', () => {
        expect(() => renderer.create(<IWImage />)).toThrow(/Images must have an alt-text/)
    })

    it('should default src if none is provided', () => {
        const component = shallow(
            <IWImage alt='sm' />
        )
        expect(component.prop('src')).toBe('https://prod-assets.insight.com/ccms_img/noImageAvailable_150x112.png')
    })

    it('should match the previous snapshot', () => {
        const component = renderer.create(
            <IWImage alt='sm' custom='prop' />
        )
        expect(component).toMatchSnapshot()
    })
})
