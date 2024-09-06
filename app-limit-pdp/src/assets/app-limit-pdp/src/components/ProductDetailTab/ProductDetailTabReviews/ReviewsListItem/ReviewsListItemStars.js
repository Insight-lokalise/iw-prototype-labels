import React from 'react'
import { StarRating } from '@insight/toolkit-react'

export const ReviewsListItemStars = ({ rating }) => (
  <div className="c-review__stars">
    <StarRating
      ediable={false}
      rating={rating}
      size="small"
      showAverage
      stars={5}
    />
  </div>
)

export default ReviewsListItemStars
