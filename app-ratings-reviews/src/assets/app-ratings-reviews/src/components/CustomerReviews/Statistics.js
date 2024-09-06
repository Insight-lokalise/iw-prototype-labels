import React from 'react'
import { t } from '@insight/toolkit-utils';
import { RatingStatistics } from '@insight/toolkit-react'

export default function Statistics({
	ratingDistribution,
	renderReviews,
	totalReviews
}) {
	return (
		<div className="c-average-rating__statistics">
			<p>{t('Select a rating to filter reviews:')}</p>
			<RatingStatistics
				ratingDistribution={ratingDistribution}
				renderReviews={renderReviews}
				totalReviews={totalReviews}
			/>
		</div>
	)
}
