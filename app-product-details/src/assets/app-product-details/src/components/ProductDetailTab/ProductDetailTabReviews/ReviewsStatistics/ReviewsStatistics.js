import React, { useContext } from 'react'
import { t } from '@insight/toolkit-utils'
import { RatingStatistics } from '@insight/toolkit-react'
import { ReviewsContext } from '../../../../context/reviews'

export const ReviewsStatistics = ({ filterReviews }) => {
  const { GET_REVIEWS = {} } = useContext(ReviewsContext)
  const { totalReviews, ratingDistribution } = GET_REVIEWS
  if (!totalReviews) return null
  return (
    <section className="c-reviews__statistics">
      <p>{t('Select a rating to filter reviews:')}</p>
      <RatingStatistics
        ratingDistribution={ratingDistribution}
        renderReviews={filterReviews}
        totalReviews={totalReviews}
      />
    </section>
  )
}

export default ReviewsStatistics
