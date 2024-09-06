import React, { Fragment } from 'react'
import { t } from '@insight/toolkit-utils';
import { StarRating, KeyboardAccessible } from '@insight/toolkit-react'

export default function AverageRating({
	averageRating,
  onClick,
}) {
	return (
		<Fragment>
			<div className="c-panel__title c-average-rating__title">
				<p>{t('Average customer ratings')}</p>
			</div>
      <KeyboardAccessible>
        <div onClick={onClick} className="c-average-rating__rating">
          <div className="c-average-rating__text">
            <p>{t('Overall rating')}</p>
            <p className="c-average-rating__numeral u-hide@tablet">{Number(averageRating.toFixed(1))} / 5</p>
          </div>
          <StarRating
            containerClassName="c-average-rating__stars"
            rating={averageRating}
            showAverage
            stars={5}
          />
          <p className="c-average-rating__numeral u-show@tablet">{Number(averageRating.toFixed(1))} / 5</p>
        </div>
      </KeyboardAccessible>
		</Fragment>
	)
}
