import React from 'react'
import Slider from 'react-slick' // Slider may require special css if it is within a flex container
import cn from 'classnames'

export function IWCarousel(props) {
    let slides = props.children

    let slidesToShow = (props.settings && props.settings.slidesToShow) || defaultSliderSettings.slidesToShow
    let needMoreSlides = !slides.length || (slides.length && slides.length < slidesToShow)

    let settings = Object.assign({}, defaultSliderSettings, {
        prevArrow: <CustomArrow direction='left' hideArrows={needMoreSlides} />,
        nextArrow: <CustomArrow direction='right' hideArrows={needMoreSlides} />,
        infinite: !needMoreSlides,
    }, props.settings)

    // Let's keep this logic for future reference. Filler slides logic may be helpful
    // if (slides.length && slides.length < slidesToShow) {
    //     const fillerSlides = Array(slidesToShow - slides.length)
    //         .fill('Empty Slide')
    //         .map((v, idx) => <div key={`${v}${idx}`} className='invisible'></div>)
    //     slides = slides.concat(fillerSlides)
    // }

    return (<Slider className={`Carousel ${props.className}`} {...settings} >
        { slides.length
            ? slides
            : <div className='loading'></div> }
    </Slider>)
}

const defaultSliderSettings = {
    slidesToShow: 5,
    infinite: false,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 1180,
            settings: {
                slidesToShow: 3,
            },
        },
        {
            breakpoint: 1600,
            settings: {
                slidesToShow: 4,
            },
        },
    ],
}

/**
 * To add custom classes to the arrows, we must wrap an element in a custom tag.
 *
 * By destructuring @param currentSlide and @param slideCount from the arguments, we prevent them
 * from filtering as attribtues to the native span tag.
 */
function CustomArrow({ currentSlide, slideCount, direction, hideArrows, ...props }) { // eslint-disable-line no-unused-vars
    return <span {...props}>
        <span className={`${cn({ hide: hideArrows })} ion-ios-arrow-${direction} Carousel__arrow`}></span>
    </span>
}
