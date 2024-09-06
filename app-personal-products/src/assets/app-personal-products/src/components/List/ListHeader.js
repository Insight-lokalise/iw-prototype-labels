import React, {Fragment} from 'react'
import { t } from '@insight/toolkit-utils'
import PropTypes from 'prop-types'

export default function ListHeader(props) {
	const { isBestPriceAvailable, isCOIAvailable, isCSIAvailable, isReservedAvailable, isAllValid, isInventorySearchEnabled } = props
  const inventorySearchOptions = isInventorySearchEnabled && (
		<div className="o-grid__item">
			<div className="o-grid u-grid-full">
				{isCOIAvailable &&
					<div className="o-grid__item u-text-center">
						<span>{t('COI')}</span>
					</div>
			  }
				{isCSIAvailable &&
					<div className="o-grid__item u-text-center">
						<span>{t('CSI')}</span>
					</div>
			  	}
				{isReservedAvailable &&
					<div className="o-grid__item u-text-center">
						<span>{t('Reserved')}</span>
					</div>
			  	}
			</div>
		</div>
	)
	const listingOptions = (
		<div className="o-grid__item">
			<div className="o-grid u-grid-full">
				<div className="o-grid__item u-text-center">
					<span>{(isAllValid || isBestPriceAvailable) && t('Unit Price')}</span>
				</div>
				<div className="o-grid__item u-text-center">
					<span>{isAllValid && t('Qty')}</span>
				</div>
			</div>
		</div>
	)

	return (
		<div className="c-list__header o-grid">
			<div className={`o-grid__item o-grid--justify-left u-1/${isInventorySearchEnabled ? '3' : '2'}@tablet`}>
				<span>{t('Item')}</span>
			</div>
			{inventorySearchOptions}
			{listingOptions}
			<div className="o-grid__item o-grid--justify-center u-1/4@tablet">
				<span>{t('Actions')}</span>
			</div>
		</div>
	)
}

ListHeader.propTypes = {
  isBestPriceAvailable: PropTypes.bool.isRequired,
  isCOIAvailable: PropTypes.bool.isRequired,
  isCSIAvailable: PropTypes.bool.isRequired,
  isReservedAvailable: PropTypes.bool.isRequired,
	isAllValid: PropTypes.bool.isRequired,
	isInventorySearchEnabled: PropTypes.bool.isRequired,
}
