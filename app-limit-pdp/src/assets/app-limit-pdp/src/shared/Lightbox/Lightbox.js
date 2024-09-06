import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import ClickOutsideWrapper from './ClickOutsideWrapper'
import './Lightbox.scss'
import { Icon } from '@insight/toolkit-react'
import Image from '../Image/Image'

const Lightbox = ({ featuredImageIndex, images, isVisible, onClose }) => {
  const [current, setCurrent] = useState(featuredImageIndex)

  function prevImage() {
    current - 1 < 0 ? setCurrent(images.length - 1) : setCurrent(current - 1)
  }

  function nextImage() {
    current + 1 === images.length ? setCurrent(0) : setCurrent(current + 1)
  }

  useEffect(() => {
    function keyboardListeners(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }

    if (isVisible) {
      document.addEventListener('keydown', keyboardListeners)
    } else {
      // keeps lightbox state in sync with featured image
      setCurrent(featuredImageIndex)
    }

    return () => document.removeEventListener('keydown', keyboardListeners)
  }, [current, featuredImageIndex, isVisible])

  const renderGallery = () => {
    if (!images?.length) return null
    return images.map((image, index) => {
      const mdProductImage = image?.images?.MD?.[0] || image?.images?.SM?.[0]
      return (
        <div
          key={index}
          className={cn(
            'c-lightbox__gallery__image o-grid__item u-1/3 u-1/2@tablet',
            {
              selected: current === index,
            }
          )}
          onClick={() => setCurrent(index)}
        >
          <Image src={mdProductImage?.url} alt={mdProductImage?.description} />
        </div>
      )
    })
  }
  const currentImages = images?.[current]?.images;
  const selectedImage = currentImages?.LG?.[0] || currentImages?.MD?.[0] || currentImages?.SM?.[0]
  return (
    <div
      className={cn('c-lightbox', {
        'c-lightbox__is-visible': isVisible,
      })}
    >
      <div className="c-lightbox__background" />
      {isVisible && (
        <ClickOutsideWrapper
          className="c-lightbox__body o-grid o-grid--justify-center"
          onClickOutside={onClose}
        >
          <div className="c-lightbox__current o-grid__item u-1/1 u-4/6@tablet">
            <div className="o-grid">
              <div className="c-lightbox__current__left-nav o-grid__item u-1/6">
                <Icon icon="arrow-left" onClick={() => prevImage()} />
              </div>
              <div className="o-grid__item u-4/6">
                <div className="c-lightbox__current__image">
                  <Image
                    src={selectedImage?.url}
                    alt={selectedImage?.description}
                  />
                </div>
              </div>
              <div className="c-lightbox__current__right-nav o-grid__item u-1/6">
                <Icon icon="arrow-right" onClick={() => nextImage()} />
              </div>
            </div>
          </div>
          <div className="c-lightbox__gallery o-grid__item u-1/1 u-2/6@tablet">
            <div className="o-grid">{renderGallery()}</div>
          </div>
          <div className="c-lightbox__close" onClick={() => onClose()}>
            <span>
              <Icon icon="close" />
            </span>
          </div>
        </ClickOutsideWrapper>
      )}
    </div>
  )
}

export default Lightbox
