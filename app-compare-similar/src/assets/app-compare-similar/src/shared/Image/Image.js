import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import FallbackImage from '@insight/toolkit-react/lib/Image/FallbackImage.js'

export const Image = ({
  src,
  alt = 'no image available',
  height,
  width,
  size,
}) => {
  const [image, setImage] = useState({ src, error: false })

  useEffect(() => {
    setImage({ src, error: false })
  }, [src])

  const renderSizes = () => {
    if (!size) return null
    return (
      <Fragment>
        {size.lg ? <source media="(min-width:980px)" srcSet={size.lg} /> : null}
        {size.md ? <source media="(min-width:740px)" srcSet={size.md} /> : null}
        {size.sm ? <source media="(min-width:320px)" srcSet={size.sm} /> : null}
      </Fragment>
    )
  }

  if (!image.src || image.error) {
    return (
      <picture>
        <FallbackImage />
      </picture>
    )
  }
  return (
    <picture>
      {renderSizes()}
      <img
        src={image.src}
        alt={alt}
        height={height}
        width={width}
        onError={() => setImage({ ...image, error: true })}
      />
    </picture>
  )
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  size: PropTypes.object,
}

export default Image
