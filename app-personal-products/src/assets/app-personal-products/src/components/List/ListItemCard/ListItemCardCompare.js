import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

/**
 * Select item for compare. The compare button can have three states:
 * O Add to Compare
 * √ Added (select 2 or more to compare)
 * √ Added
 */
 export default function ListItemCardCompare({
 	isSelectedToCompare,
 	needsCompareTo,
 	sequence,
 	toggleSelectToCompare
 }) {
 	const compareText = isSelectedToCompare ? t('Added') : t('Add to compare')
 	const needsMoreText = needsCompareTo && t('(Select two or more for comparison)')
 	const icon = isSelectedToCompare && (
 		<Icon
 			className="c-item-card__compare-icon"
 			icon="checkmark-circled"
 			title={compareText}
 		/>
 	)

 	return (
 		<button
 			className="c-item-card__compare o-button--subtle"
 			onClick={toggleSelectToCompare}
 		>
 			{icon}
 			<span>{compareText}</span>
 			{needsMoreText}
 		</button>
 	)
 }

 ListItemCardCompare.propTypes = {
 	isSelectedToCompare: PropTypes.bool.isRequired,
 	needsCompareTo: PropTypes.bool.isRequired,
 	sequence: PropTypes.number.isRequired,
 	toggleSelectToCompare: PropTypes.func.isRequired
 }
