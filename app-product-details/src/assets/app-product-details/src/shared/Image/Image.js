import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export const Image = ({
  src,
  alt = 'no image available',
  height,
  width,
  size,
  addItemProp
}) => {
  const [image, setImage] = useState({ src, error: false })
  const fallbackImage = '/content/dam/insight-web/source/img/default-no-image_150x112.png'

  useEffect(() => {
    setImage({ src, error: false })
  }, [src])

  const renderSizes = () => {
    if (!size) return null
    return (
      <Fragment>
        {size.LG ? <source media="(min-width:980px)" srcSet={size.LG} /> : null}
        {size.MD ? <source media="(min-width:740px)" srcSet={size.MD} /> : null}
        {size.SM ? <source media="(min-width:320px)" srcSet={size.SM} /> : null}
      </Fragment>
    )
  }

  const imageSrc = (!image.src || image.error) ? fallbackImage : image.src

  return (
    <picture>
      {renderSizes()}
      <img
        src={imageSrc}
        alt={alt}
        height={height}
        width={width}
        onError={() => setImage({ ...image, error: true })}
        itemProp={addItemProp ? "image" : null }
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
  addItemProp: PropTypes.bool
}

export default Image
