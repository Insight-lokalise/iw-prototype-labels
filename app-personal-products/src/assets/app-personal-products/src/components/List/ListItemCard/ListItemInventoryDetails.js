import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

export default function ListItemInventoryDetails({
	availability,
	hasCOI,
	hasCSI,
	hasReserved
}) {
	return (
		<div className="o-grid__item c-item-card__inventory-grid">
			<div className="o-grid">
				{hasCOI && (
					<div className="o-grid__item u-text-center">
						<p className="c-item-card__inventory-label">{t('COI')}</p>
						{availability.coi}
					</div>
				)}
				{hasCSI && (
					<div className="o-grid__item u-text-center">
						<p className="c-item-card__inventory-label">{t('CSI')}</p>
						{availability.csi}
					</div>
				)}
				{hasReserved && (
					<div className="o-grid__item u-text-center">
						<p className="c-item-card__inventory-label">{t('Reserved')}</p>
						{availability.cai}
					</div>
				)}
			</div>
		</div>
	)
}

ListItemInventoryDetails.propTypes = {
  	availability: PropTypes.shape({
		stock: PropTypes.number,
		coi: PropTypes.number,
		csi: PropTypes.number,
		reserved: PropTypes.number,
	}).isRequired,
	hasCOI: PropTypes.bool.isRequired,
	hasCSI: PropTypes.bool.isRequired,
	hasReserved: PropTypes.bool.isRequired,
}
