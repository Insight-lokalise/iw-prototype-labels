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
    <div className="o-grid__item u-1/1 u-1/2@tablet">
      <ReviewsListItemRecommendation isRecommended={isRecommended} />
    </div>
    <div className="o-grid__item u-1/1 u-1/2@tablet">
      <div className="o-grid">
        <span className="c-reviews__list__item__footer-text o-grid__item u-1/3 u-text-bold">
          {t('Was this helpful?')}
        </span>
        <span className="o-grid__item u-1/3">
          <ReviewsListItemFeedbackButtons
            increaseNegativeCount={increaseNegativeCount}
            increasePositiveCount={increasePositiveCount}
            negativeHelpfulnessSubmitted={negativeHelpfulnessSubmitted}
            positiveHelpfulnessSubmitted={positiveHelpfulnessSubmitted}
            totalNegativeFeedbackCount={totalNegativeFeedbackCount}
            totalPositiveFeedbackCount={totalPositiveFeedbackCount}
          />
        </span>
        <span className="o-grid__item u-1/3">
          <ReviewsListItemSubmitReport
            reportSubmitted={reportSubmitted}
            submitReport={submitReport}
          />
        </span>
      </div>
    </div>
  </div>
)

export default ReviewsListItemFooter
