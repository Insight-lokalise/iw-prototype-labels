import React, { useContext } from 'react'
import { StarRating, KeyboardAccessible } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { ReviewsContext } from '../../../../context/reviews'

export const ReviewsAverageRating = ({ onClick }) => {
  const { GET_REVIEWS = {} } = useContext(ReviewsContext)
  if (!GET_REVIEWS.totalReviews) return null
  return (
    <section className="c-reviews__average-rating u-margin-bot-small">
      <KeyboardAccessible>
        <div onClick={onClick} className="c-reviews__average-rating__container">
          <span className="c-reviews__average-rating__text">
            {t('Overall rating')}
          </span>
          <span className="c-reviews__average-rating__stars">
            <StarRating
              containerClassName="c-reviews__average-rating__stars"
              rating={GET_REVIEWS.averageRating}
              showAverage
              stars={5}
            />
          </span>
          <span className="c-reviews__average-rating__numeral">
            {Number(GET_REVIEWS.averageRating.toFixed(1))} / 5
          </span>
        </div>
      </KeyboardAccessible>
    </section>
  )
}

export default ReviewsAverageRating
