import React from 'react'
import PropTypes from 'prop-types'
import { ScreenReaderOnly } from '@insight/toolkit-react'

import { t } from '@insight/toolkit-utils'
import ListItemCardCompare from './ListItemCardCompare'

export default function ListItemCardDetails({
	addToCompareProps,
	description,
	imageURL,
	manufacturerPartNumber,
	materialId
}) {
	return (
		<div className="c-item-card__details o-grid__item u-1/1 u-1/3@tablet u-1/2@tablet-landscape">
			<div>
				<img src={imageURL} alt={description} className="c-image" />
				<ScreenReaderOnly><p>{description}</p></ScreenReaderOnly>
			</div>
			<div>
				<h5>{description}</h5>
				<p>{t('Insight Part #')}: {materialId}</p>
				<p>{t('Mfr part #')}:{' '}{manufacturerPartNumber}</p>
				<ListItemCardCompare {...addToCompareProps} />
			</div>
		</div>
	)
}

ListItemCardDetails.propTypes = {
	description: PropTypes.string.isRequired,
	imageURL: PropTypes.string.isRequired,
	manufacturerPartNumber: PropTypes.string.isRequired,
	materialId: PropTypes.string.isRequired
}
