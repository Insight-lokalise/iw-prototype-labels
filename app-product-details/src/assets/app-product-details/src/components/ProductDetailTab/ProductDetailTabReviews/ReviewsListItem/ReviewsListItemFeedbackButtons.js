import React, { Fragment } from 'react'
import cn from 'classnames'

import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from '@insight/toolkit-utils'

export const ReviewsListItemFeedbackButtons = ({
  increaseNegativeCount,
  increasePositiveCount,
  negativeHelpfulnessSubmitted,
  positiveHelpfulnessSubmitted,
  totalNegativeFeedbackCount = 0,
  totalPositiveFeedbackCount = 0,
}) => {
  const baseClasses =
    'c-review__footer__feedback-button o-grid__item o-grid__item--shrink'
  const positiveClasses = cn(
    'c-review__footer__feedback-button--positive',
    {
      'is-clicked': positiveHelpfulnessSubmitted,
    },
    baseClasses
  )
  const negativeClasses = cn(
    'c-review__footer__feedback-button--negative',
    {
      'is-clicked': negativeHelpfulnessSubmitted,
    },
    baseClasses
  )

  return (
    <Fragment>
      <Button
        className={positiveClasses}
        color="none"
        onClick={increasePositiveCount}
      >
        {`${t('Yes')} - `}
        {totalPositiveFeedbackCount}
      </Button>
      <span className="c-reviews__list__item__footer__divider">|</span>
      <Button
        className={negativeClasses}
        color="none"
        onClick={increaseNegativeCount}
      >
        {`${t('No')} - `}
        {totalNegativeFeedbackCount}
      </Button>
    </Fragment>
  )
}

export default ReviewsListItemFeedbackButtons
