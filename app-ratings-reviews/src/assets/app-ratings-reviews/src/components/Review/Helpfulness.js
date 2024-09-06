import React from 'react'
import { t } from '@insight/toolkit-utils';
import FeedbackButtons from './FeedbackButtons'
import SubmitReport from './SubmitReport'

export default function Helpfulness({
	increaseNegativeCount,
	increasePositiveCount,
	negativeHelpfulnessSubmitted,
	positiveHelpfulnessSubmitted,
	reportSubmitted,
	submitReport,
	totalNegativeFeedbackCount,
	totalPositiveFeedbackCount
}) {
	return (
		<div className="c-review__helpfulness o-grid">
			<p className="c-review__helpfulness-text o-grid__item u-1/4 u-1/5@tablet u-hide@desktop">{t('Helpful?')}</p>
			<p className="c-review__helpfulness-text o-grid__item u-show@desktop u-1/3@desktop">{t('Was this review helpful?')}</p>
			<FeedbackButtons
				increaseNegativeCount={increaseNegativeCount}
				increasePositiveCount={increasePositiveCount}
				negativeHelpfulnessSubmitted={negativeHelpfulnessSubmitted}
				positiveHelpfulnessSubmitted={positiveHelpfulnessSubmitted}
				totalNegativeFeedbackCount={totalNegativeFeedbackCount}
				totalPositiveFeedbackCount={totalPositiveFeedbackCount}
			/>
			<SubmitReport reportSubmitted={reportSubmitted} submitReport={submitReport} />
		</div>
	)
}
