// React Modules
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { t } from "@insight/toolkit-utils/lib/labels";
import { Helmet } from "react-helmet";
import { Button, PartNumbers, StarRating } from '@insight/toolkit-react'
import { PDPContext } from '../context'
import { UIContext } from '../shared/UIContext/UIContext'
import { useResponsive } from '../hooks/useResponsive'
import { ProductSEO } from './ProductSEO'

export const ProductHeader = () => {
  const { scrollIntoView } = useContext(UIContext)
  const { product, getProductReviews } = useContext(PDPContext)
  const { locale } = useParams()
  const [reviews, setReviews] = useState({ totalReviews: 0, averageRating: 0 })
  const history = useHistory()
  const [isMobile] = useResponsive()

  useEffect(() => {
    getReviewRatings()
  }, [])

  const getReviewRatings = async () => {
    try {
      const { totalReviews, averageRating } = await getProductReviews({
        locale,
        materialId: product?.materialId,
        limit: 1,
      })
      setReviews({ totalReviews, averageRating })
    } catch (err) {}
  }

  return (
    <section className="c-product-header o-grid">
      <Helmet>
        <title>{product?.descriptions?.shortDescription}</title>
        <meta name="description" content={t('Limit PDP Page')} />
      </Helmet>
      <h1
        className="c-product-header__name u-1/1"
        aria-label={`Product page for ${product?.descriptions?.shortDescription}`}
      >
        {product?.descriptions?.shortDescription}
      </h1>
      <div className="c-product-header__subtitle o-grid">
        <div className="c-product-header__partnumbers o-grid__item u-1/1">
          <PartNumbers
            insightPart={product?.materialId}
            mfrPart={product?.manufacturer?.partNumber}
          />
        </div>
        <div className="o-grid__item u-1/1">
          <div className="c-product-header__reviews">
            <StarRating size="small" rating={reviews.averageRating} stars={5} />
            <span className="c-product-header__reviews__count">
              ({reviews.totalReviews})
            </span>
          </div>
        </div>
      </div>
      <ProductSEO reviews={reviews} />
    </section>
  )
}

export default ProductHeader
