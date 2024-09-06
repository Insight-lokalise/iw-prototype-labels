import React from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from '@insight/toolkit-utils'

export const ReviewsListItemSubmitReport = ({
  reportSubmitted,
  submitReport,
}) => (
  <Button
    className="o-grid__item o-grid__item--shrink c-review__helpfulness-button"
    color="none"
    onClick={submitReport}
  >
    <span>{reportSubmitted ? t('Reported') : t('Report an issue')}</span>
  </Button>
)

export default ReviewsListItemSubmitReport
