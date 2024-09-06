import React from 'react'
import { t } from '@insight/toolkit-utils'
import { ReviewsListItemRecommendation } from './ReviewsListItemRecommendation'
import { ReviewsListItemFeedbackButtons } from './ReviewsListItemFeedbackButtons'
import { ReviewsListItemSubmitReport } from './ReviewsListItemSubmitReport'

export const ReviewsListItemFooter = ({
  isRecommended,
  increaseNegativeCount,
  increasePositiveCount,
  negativeHelpfulnessSubmitted,
  positiveHelpfulnessSubmitted,
  reportSubmitted,
  submitReport,
  totalNegativeFeedbackCount,
  totalPositiveFeedbackCount,
}) => (
  <div className="c-reviews__list__item__footer o-grid">
    <div className="o-grid__item u-1/1">
      <ReviewsListItemRecommendation isRecommended={isRecommended} />
    </div>
  </div>
)

export default ReviewsListItemFooter
