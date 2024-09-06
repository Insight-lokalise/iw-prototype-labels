import React, { Fragment } from 'react'
import cn from 'classnames'

import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from '@insight/toolkit-utils'

export default function FeedbackButtons({
	increaseNegativeCount,
	increasePositiveCount,
	negativeHelpfulnessSubmitted,
	positiveHelpfulnessSubmitted,
	totalNegativeFeedbackCount,
	totalPositiveFeedbackCount
}) {
	const baseClasses = 'c-review__helpfulness-button o-grid__item o-grid__item--shrink'
	const positiveClasses = cn('c-review__helpfulness-button--positive', {
		'is-clicked': positiveHelpfulnessSubmitted
	}, baseClasses)
	const negativeClasses = cn('c-review__helpfulness-button--negative', {
		'is-clicked': negativeHelpfulnessSubmitted
	}, baseClasses)

	return (
		<Fragment>
			<Button
				className={positiveClasses}
				color="link"
				onClick={increasePositiveCount}
			>
				{`${t('Yes')} - `}{totalPositiveFeedbackCount}
			</Button>
      <span className="c-review__helpfulness-button--separator">|</span>
			<Button
				className={negativeClasses}
				color="link"
				onClick={increaseNegativeCount}
			>
				{`${t('No')} - `}{totalNegativeFeedbackCount}
			</Button>
		</Fragment>
	)
}
