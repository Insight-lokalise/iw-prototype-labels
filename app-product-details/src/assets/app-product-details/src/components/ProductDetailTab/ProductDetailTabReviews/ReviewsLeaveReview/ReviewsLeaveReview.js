import React, { Fragment, useContext } from 'react'
import { t } from '@insight/toolkit-utils'
import { Button } from '@insight/toolkit-react'
import { ReviewsContext } from '../../../../context/reviews'

export const ReviewsLeaveReview = ({ openSubmissionFormModal }) => {
  const { GET_REVIEWS } = useContext(ReviewsContext)
  const isB2BUser = GET_REVIEWS?.user?.userInformation?.b2bInfo?.isB2B
  const isSharedUser =
    GET_REVIEWS?.user?.userInformation?.UserType === 'Shared' ? true : false
  const isUserAllowedToReview = !isB2BUser || !isSharedUser

  if (isUserAllowedToReview) {
    return (
      <div className="c-reviews__leave-review u-margin-bot-small">
        <Button color="secondary" onClick={openSubmissionFormModal}>
          {t('Leave a review')}
        </Button>
      </div>
    )
  }

  return (
    <div className="c-reviews__leave-review u-margin-bot-small">
      {t('You must be logged in to leave a review.')}
      <br />
      <Button color="link" href="/insightweb/login">
        {t('Login now')}
      </Button>
    </div>
  )
}

export default ReviewsLeaveReview
