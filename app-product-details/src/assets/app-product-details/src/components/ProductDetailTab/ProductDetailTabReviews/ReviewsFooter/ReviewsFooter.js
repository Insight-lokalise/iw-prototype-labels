import React, { useContext } from 'react'
import { Button, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { UIContext } from '../../../../shared/UIContext/UIContext'
import { ReviewsContext } from '../../../../context/reviews'

export const ReviewsFooter = ({ showMore }) => {
  const { scrollIntoView } = useContext(UIContext)
  const { GET_REVIEWS = {} } = useContext(ReviewsContext)
  const { defaultCount, totalResults, error } = GET_REVIEWS
  const renderedReviewCount =
    totalResults > defaultCount ? defaultCount : totalResults

  if (error) return <div>{t(error)}</div>
  const renderShowMore = () => {
    if (renderedReviewCount === totalResults) return null
    return (
      <div className="o-grid o-grid--justify-center">
        <div className="o-grid__item o-grid__item--shrink">
          <Button
            className="o-grid__item"
            color="link"
            onClick={() => showMore(defaultCount + 5)}
          >
            {t('Show more')} <Icon icon={'arrow-dropdown'} />
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="c-reviews__footer o-grid o-grid--justify-between">
        <p className="o-grid__item">
          {renderedReviewCount}
          {` ${t('of')} `}
          {totalResults}
          {` ${t('Reviews')}`}
        </p>
        <Button
          className="o-grid__item u-show@tablet  o-grid__item--shrink"
          color="link"
          onClick={() => scrollIntoView('tabs')}
        >
          {t('Back to top')}
        </Button>
      </div>
      <div>{renderShowMore()}</div>
    </div>
  )
}

export default ReviewsFooter
