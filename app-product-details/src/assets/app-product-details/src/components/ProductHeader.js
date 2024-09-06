// React Modules
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, PartNumbers, StarRating } from '@insight/toolkit-react'
import { getCurrentLocale } from '@insight/toolkit-utils'
import { t } from '@insight/toolkit-utils/lib/labels'
import { PDPContext } from '../context'
import { UIContext } from '../shared/UIContext/UIContext'
import { useResponsive } from '../hooks/useResponsive'
import { ProductSEO } from './ProductSEO'
import { getReviewsAndRatingsFeatureFlag } from '../shared'

export const ProductHeader = () => {
  const { scrollIntoView } = useContext(UIContext)
  const { product, getProductReviews } = useContext(PDPContext)
  const locale = getCurrentLocale('insight_locale')
  const [reviews, setReviews] = useState({ totalReviews: 0, averageRating: 0 })
  const history = useHistory()
  const [isMobile] = useResponsive()
  const displayReviewsAndRatings = getReviewsAndRatingsFeatureFlag();

  useEffect(() => {
    if (displayReviewsAndRatings) {
      getReviewRatings();
    }
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
      <h1
        className="c-product-header__name u-1/1"
        aria-label={`Product page for ${product?.descriptions?.shortDescription}`}
      >
        {product?.descriptions?.shortDescription}
      </h1>
      <div className="c-product-header__subtitle o-grid u-1/1">
        <div className="c-product-header__partnumbers">
          <PartNumbers
            insightPart={product?.materialId}
            mfrPart={product?.manufacturer?.partNumber}
            unspsc={product?.commodityCode}
          />
        </div>
        {displayReviewsAndRatings && (
          <div className="o-grid">
            <Button
              color="none"
              className="c-product-header__reviews"
              onClick={() => {
                if (isMobile) {
                  scrollIntoView('tab-reviews')
                  return
                }
                scrollIntoView('tabs')
                history.push({
                  hash: '#tab-reviews',
                })
              }}
              aria-label={t('Go to reviews section')}
            >
              <StarRating size="small" rating={reviews.averageRating} stars={5} />
              <span className="c-product-header__reviews__count">
                ({reviews.totalReviews})
              </span>
            </Button>
          </div>
        )}
      </div>
      <ProductSEO reviews={reviews} />
    </section>
  )
}

export default ProductHeader
