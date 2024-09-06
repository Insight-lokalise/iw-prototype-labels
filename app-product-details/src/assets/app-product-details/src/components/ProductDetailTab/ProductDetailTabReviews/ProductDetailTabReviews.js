import React, { useContext, useEffect, useState } from 'react'
import { Loading } from '@insight/toolkit-react'
import { ReviewSubmission } from './ReviewSubmission/ReviewSubmission'
import { ProductDetailTabReviewsView } from './ProductDetailTabReviewsView'
import { PDPContext } from '../../../context'
import { ReviewsContext } from '../../../context/reviews'

export const ProductDetailTabReviews = () => {
  const { product } = useContext(PDPContext)
  const { GET_REVIEWS, getReviewsAction } = useContext(ReviewsContext)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const openSubmissionFormModal = () => setModalIsOpen(true)

  useEffect(() => {
    getReviewsAction({
      materialId: product.materialId,
      limit: 5,
      sortBy: 'SubmissionTime:desc,Rating:desc',
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
      <ProductDetailTabReviewsView
        openSubmissionFormModal={openSubmissionFormModal}
      />
      {modalIsOpen && (
        <ReviewSubmission
          closeModal={() => setModalIsOpen(false)}
          modalIsOpen={modalIsOpen}
        />
      )}
    </div>
  )
}

export default ProductDetailTabReviews
