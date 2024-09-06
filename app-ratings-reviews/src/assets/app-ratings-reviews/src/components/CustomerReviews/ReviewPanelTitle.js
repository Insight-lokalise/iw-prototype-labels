import React from 'react'
import PropTypes from 'prop-types'

import Dropdown from '@insight/toolkit-react/lib/Dropdown/Dropdown'
import { t } from '@insight/toolkit-utils'

import { options } from '../../constants'

export default function ReviewPanelTitle({
	filterText,
	hasMultipleReviews,
	sortByOptions,
	totalReviewsByRating
}) {
  const totalReviewsByRatingText = totalReviewsByRating === 0 ? '' :`(${totalReviewsByRating})`
	return (
		<div className="c-review-panel__title c-panel__title">
			<div className="c-review-panel__title-text">
				<p className="u-hide@tablet">{t('Reviews')} ({totalReviewsByRating})</p>
				<p className="u-show@tablet">{t('Customer reviews')} {totalReviewsByRatingText}</p>
			</div>
      {hasMultipleReviews && <span className="u-show@tablet"><p>{t('Sort by:')}</p></span>}
			{hasMultipleReviews && (
				<Dropdown
					className="c-review-panel__dropdown"
					color="link"
					id="sortDropdown"
					position="right"
					text={t(filterText)}
				>
					{options.map((option, key) => (
						<button
							className="c-dropdown__item c-review-panel__dropdown-item"
							key={option.value}
							onClick={sortByOptions(option.value, option.label)}
						>
							{t(option.label)}
						</button>
					))}
				</Dropdown>
			)}
		</div>
	)
}
