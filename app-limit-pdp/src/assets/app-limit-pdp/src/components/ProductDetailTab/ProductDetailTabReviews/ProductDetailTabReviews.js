import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '@insight/toolkit-react'
import { ProductDetailTabReviewsView } from './ProductDetailTabReviewsView'
import { PDPContext } from '../../../context'
import { ReviewsContext } from '../../../context/reviews'

export const ProductDetailTabReviews = () => {
  const { product } = useContext(PDPContext)
  const { GET_REVIEWS, getReviewsAction } = useContext(ReviewsContext)
  const { locale } = useParams()

  useEffect(() => {
    getReviewsAction({
      materialId: product.materialId,
      limit: 5,
      sortBy: 'SubmissionTime:desc,Rating:desc',
      locale
    })
  }, [])

  if (GET_REVIEWS?.loading) {
    return (
      <div className="c-pdp-page__view">
        <Loading className="c-loading c-loading__reviews" />
      </div>
    )
  }

  return (
    <div className="c-product-tabs__reviews">
      <ProductDetailTabReviewsView />
    </div>
  )
}

export default ProductDetailTabReviews
