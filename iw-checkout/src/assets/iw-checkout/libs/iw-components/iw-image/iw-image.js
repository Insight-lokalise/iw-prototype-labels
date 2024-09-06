import React from 'react'
/**
 * A component that wraps a <img> tag.
 * Enforces an alt attribute.
 *
 * We could do a few more things with this:
 *  - Lazy load
 *  - Display a loading icon while the image is loading
 *
 * @param {props} { src, alt, ...props } src/alt are required.
 */
export function IWImage({ src, alt, ...props }) {
    if (!alt) throw Error('Insight Images must have an alt-text attribute.')
    if (!src) src = 'https://prod-assets.insight.com/ccms_img/noImageAvailable_150x112.png'
    return (
        <img className={props.className}
            src={src}
            alt={alt}
            onClick={props.onClick}
            { ...props } />
    )
}
