import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from '@insight/toolkit-utils'

export default function SubmitReport({
	reportSubmitted,
	submitReport
}) {
	const reportText = reportSubmitted
		? t('Reported')
		: (
			<Fragment>
				<span className="u-hide@desktop">{t('Report')}</span>
				<span className="u-show@desktop">{t('Report an issue')}</span>
			</Fragment>
		)

	return (
		<Button
			className="o-grid__item o-grid__item--shrink c-review__helpfulness-button"
			color="link"
			onClick={submitReport}
		>
			{reportText}
		</Button>
	)
}
