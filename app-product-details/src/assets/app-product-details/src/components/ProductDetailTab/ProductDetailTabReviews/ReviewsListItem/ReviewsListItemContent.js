import React from 'react'
import { Button, Date } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import PropTypes from 'prop-types'

export const ReviewsListItemContent = ({
  expanded,
  reviewText,
  showMoreOrLessText,
  SubmissionTime,
  title,
  subTitle,
  userNickname,
}) => {
  const displayedText = expanded ? reviewText : reviewText?.substr(0, 500)

  const renderShowMoreButton = () => {
    if (!displayedText || reviewText.length < 500) return null
    return (
      <Button
        className="c-reviews__list__item__show-more"
        color="inline-link"
        onClick={showMoreOrLessText}
      >
        <span>{expanded ? t('Show less') : t('...Show more')}</span>
      </Button>
    )
  }
  return (
    <div className="c-reviews__list__item__content">
      <div className="c-reviews__list__item__title">{title}</div>
      <div className="c-reviews__list__item__subTitle">{subTitle}</div>
      <div className="c-reviews__list__item__text">
        {displayedText}
        {renderShowMoreButton()}
      </div>
      <div className="c-reviews__list__item__user">
        {userNickname} -{' '}
        <span className="c-reviews__list__item__date">
          <Date date={SubmissionTime} />
        </span>
      </div>
    </div>
  )
}

ReviewsListItemContent.propTypes = {
  expanded: PropTypes.bool.isRequired,
  reviewText: PropTypes.string.isRequired,
  showMoreOrLessText: PropTypes.func.isRequired,
  SubmissionTime: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  userNickname: PropTypes.string.isRequired,
}

export default ReviewsListItemContent
