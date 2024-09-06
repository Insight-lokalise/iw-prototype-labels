import React, { useContext } from 'react'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { ReviewsContext } from '../../../../context/reviews'
import { REVIEW_SORT_OPTIONS } from '../../../../constants'

export const ReviewPanelTitle = ({ sort, onSort }) => {
  const { GET_REVIEWS = {} } = useContext(ReviewsContext)
  return (
    <section className="c-reviews__panel-title o-grid">
      <div className="c-reviews__panel-title__text o-grid__item">
        {t('Customer reviews')}{' '}
        {GET_REVIEWS.totalResults && `(${GET_REVIEWS.totalResults})`}
      </div>
      {GET_REVIEWS.totalReviews > 1 && (
        <div className="o-grid__item text-right">
          <Field
            className="o-grid o-grid--justify-right c-reviews__panel-title__select"
            fieldComponent="Select"
            aria-label="Sort Reviews"
            name="sortReviews"
            value={sort}
            handleChange={({ target }) => onSort(target.value)}
            options={REVIEW_SORT_OPTIONS}
          />
        </div>
      )}
    </section>
  )
}

export default ReviewPanelTitle
