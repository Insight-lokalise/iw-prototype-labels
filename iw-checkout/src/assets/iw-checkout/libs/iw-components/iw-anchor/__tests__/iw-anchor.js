import React from 'react'
import renderer from 'react-test-renderer'
import { IWAnchor } from './../iw-anchor'

describe('<IWAnchor>', () => {
    it('should render children', () => {
        const component = renderer.create(
            <IWAnchor className='B__E--M'>
                Clickable
                <strong>text</strong>
            </IWAnchor>
        )
        expect(component).toMatchSnapshot()
    })
})
