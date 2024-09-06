import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Image from '../Image/Image'

const MOBILE_VIEWPORT_THRESHOLD = 220

export const ImageCarousel = ({ images, selectedIndex = 0, onImageSelect, addItemProp=false, imagesAltText }) => {
  if (!images?.length) return null

  const totalImages = images.length
  const viewport = useRef()
  const maxImgCountWithSeoAttr = 5;

  useEffect(() => {
    // Set visible item offset on index change
    const imagesViewport = viewport.current
    // Set offset to selected index * image width + margin
    let offset = Math.ceil(selectedIndex * 72)
    // Scroll images viewport to selected index
    const visibleImages =
      imagesViewport.clientWidth > MOBILE_VIEWPORT_THRESHOLD ? 3 : 2
    if (selectedIndex + visibleImages >= totalImages) {
      return
    }
    imagesViewport.style.transform = `translate3d(-${offset}px, 0, 0)`
  }, [selectedIndex])

  const prevImage = () => {
    selectedIndex - 1 < 0
      ? onImageSelect(totalImages - 1)
      : onImageSelect(selectedIndex - 1)
  }

  const nextImage = () => {
    selectedIndex + 1 === totalImages
      ? onImageSelect(0)
      : onImageSelect(selectedIndex + 1)
  }

  const renderImages = () => {
    return images.map((image, index) => {
      const selected = index === selectedIndex
      const smProductImage = image?.images?.SM?.[0]
      return (
        <div
          key={index}
          className={cn('c-product-gallery__thumbnails__images__image', {
            selected,
          })}
          onClick={() => onImageSelect(index)}
        >
          <Image src={smProductImage?.url} alt={imagesAltText}
                 addItemProp={index < maxImgCountWithSeoAttr ? addItemProp : false}/>
        </div>
      )
    })
  }
  return (
    <div className="c-product-gallery__thumbnails o-grid__item">
      {totalImages > 1 ? (
        <div className="c-product-gallery__thumbnails__control">
          <Button
            color="none"
            icon="arrow-left"
            isDisabled={selectedIndex === 0}
            tabIndex="0"
            aria-label={t('Go to previous image')}
            onClick={() => prevImage()}
          />
        </div>
      ) : null}
      <div className="c-product-gallery__thumbnails__viewport">
        <div ref={viewport} className="c-product-gallery__thumbnails__images">
          {renderImages()}
        </div>
      </div>
      {totalImages > 1 ? (
        <div className="c-product-gallery__thumbnails__control">
          <Button
            color="none"
            icon="arrow-right"
            isDisabled={selectedIndex + 1 === totalImages}
            tabIndex="0"
            aria-label={t('Go to next image')}
            onClick={() => nextImage()}
          />
        </div>
      ) : null}
    </div>
  )
}

export default ImageCarousel
