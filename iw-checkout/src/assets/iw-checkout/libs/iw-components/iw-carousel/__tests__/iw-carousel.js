import React from 'react'
import { shallow, mount } from 'enzyme'

import { IWCarousel } from './../iw-carousel'

/**
 * Tests on this component should test the internal logic for hiding and showing
 * arrows based on slide length and using default/custom arrows.
 *
 * Snapshot testing would be more valuable on the business components that
 * implement this iw-component.
 */
describe('<IWCarousel>', () => {
    it('should hide arrows when slides < slidesToShow', () => {
        const slides = [
            { name: 'Projector', price: 200 },
            { name: 'Screen', price: 60 },
            { name: 'Cable', price: 20 },
        ].map(item => <div className="Test__slide" key={item.price}>
            {item.name} <strong>{item.price}</strong>
        </div>)
        const component = mount(
            <IWCarousel>
                { slides }
            </IWCarousel>
        )
        expect(component.find('.Carousel__arrow.hide').length).toBe(2)
    })

    it('should not hide arrows when slides > slidesToShow', () => {
        const slides = [
            { name: 'Projector', price: 200 },
            { name: 'Screen', price: 60 },
            { name: 'Cable', price: 20 },
        ].map(item => <div className="Test__slide" key={item.price}>
            {item.name} <strong>{item.price}</strong>
        </div>)
        const component = mount(
            <IWCarousel settings={{ slidesToShow: 2 }}>
                { slides }
            </IWCarousel>
        )
        expect(component.find('.Carousel__arrow').length).toBe(2)
        expect(component.find('.Carousel__arrow.hide').length).toBe(0)
    })

    it('should match snapshot', () => {
        const slides = [
            { name: 'Projector', price: 200 },
            { name: 'Screen', price: 60 },
            { name: 'Cable', price: 20 },
        ].map(item => <div key={item.price}>{item.name} <strong>{item.price}</strong></div>)
        const component = shallow(
            <IWCarousel className="Test__carousel">
                { slides }
            </IWCarousel>
        )
        expect(component).toMatchSnapshot()
    })
})
