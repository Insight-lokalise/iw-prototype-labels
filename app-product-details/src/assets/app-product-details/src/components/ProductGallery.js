import React, { useState, useContext } from 'react'
import { Image } from '../shared/Image/Image'
import Lightbox from '../shared/Lightbox/Lightbox'
import { PDPContext } from '../context'
import { ImageCarousel } from '../shared/ImageCarousel/ImageCarousel'

export const ProductGallery = () => {
  const { product } = useContext(PDPContext)
  // Get featured using the first front image or the no angle image
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0)
  const [isLightboxVisible, setIsLightboxVisible] = useState(false)

  const selectImage = (index) => {
    setFeaturedImageIndex(index)
  }

  const featuredImage = product?.images?.[featuredImageIndex]
  const mdFeaturedImage = featuredImage?.images?.MD?.[0] || featuredImage?.images?.LG?.[0] || featuredImage?.images?.SM?.[0]
  const altText = `${product?.descriptions?.shortDescription}, ${product?.manufacturer?.name}, ${product?.materialId}, ${mdFeaturedImage?.description}`

  return (
    <section className="c-product-gallery">
      <Lightbox
        featuredImageIndex={featuredImageIndex}
        images={product?.images}
        isVisible={isLightboxVisible}
        onClose={() => setIsLightboxVisible(false)}
      />
      <div className="c-product-gallery__container o-grid o-grid--justify-center">
        <div
          className="c-product-gallery__featured-image o-grid__item u-1/1"
          onClick={() => setIsLightboxVisible(true)}
        >
          <Image
            src={mdFeaturedImage?.url}
            alt={altText}
          />
        </div>
        <ImageCarousel
          images={product?.images}
          selectedIndex={featuredImageIndex}
          onImageSelect={selectImage}
          addItemProp={true}
          imagesAltText={altText}
        />
      </div>
    </section>
  )
}

export default ProductGallery
