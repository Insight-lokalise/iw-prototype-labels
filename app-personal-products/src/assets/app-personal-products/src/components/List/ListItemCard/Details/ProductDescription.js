import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import ProductCompare from '../../../../containers/ProductCompare'
import CompanyStandardsIcon from './CompanyStandardsIcon'

export default function ProductDescription({
	addToCompareProps,
	approvedItem,
	bullet1,
	bullet2,
	bullet3,
	bullet4,
  callForAvailability,
  callForPrice,
	isValid,
	description,
	itemURL,
	manufacturerPartNumber,
	materialId,
  proratable,
	softwareLicenseType,
	standardProduct,
	getProductCompareHref
}) {

  const isProductAvailable = !callForPrice && !callForAvailability
	return (
		<div className="o-grid__item">
			{isValid && isProductAvailable ?
				<a href={itemURL}>
					<h5 className="c-item-card__details-description">{description}</h5>
				</a>
				: <h5 className="c-item-card__details-description-disabled">{description}</h5>
			}
			<p className="c-item-card__details-text">{t('Insight Part #')}: {materialId}</p>
			<p className="c-item-card__details-text">{t('Mfr part #')}:{' '}{manufacturerPartNumber}</p>
			<ul className="c-item-card__details-bullets">
				{approvedItem && <li>{t('Approved Item')}</li>}
				{bullet1 && <li>{bullet1}</li>}
				{bullet2 && <li>{bullet2}</li>}
				{bullet3 && <li>{bullet3}</li>}
				{bullet4 && <li>{bullet4}</li>}
			</ul>
			{standardProduct && <CompanyStandardsIcon />}

			{proratable && softwareLicenseType && <p>{t('The price displayed will be prorated in the cart based on the remaining agreement period.')}</p>}
			{isValid && <ProductCompare
				addToCompareProps={addToCompareProps}
				materialId={materialId}
				getProductCompareHref={getProductCompareHref}
			/>}
      {!isProductAvailable && <p>{t('This product is unavailable. Please contact your support team for assistance.')}</p>}
		</div>
	)
}

ProductDescription.propTypes = {
	addToCompareProps: PropTypes.shape({
		isSelectedToCompare: PropTypes.bool,
		needsCompareTo: PropTypes.bool,
		toggleSelectToCompare: PropTypes.func
	}).isRequired,
	approvedItem: PropTypes.bool.isRequired,
	bullet1: PropTypes.string,
	bullet2: PropTypes.string,
	bullet3: PropTypes.string,
	bullet4: PropTypes.string,
	description: PropTypes.string,
	isValid:PropTypes.bool,
	itemURL: PropTypes.string,
	manufacturerPartNumber: PropTypes.string,
	materialId: PropTypes.string.isRequired,
	softwareLicenseType: PropTypes.string,
	standardProduct: PropTypes.bool
}

ProductDescription.defaultProps = {
	bullet1: '',
	bullet2: '',
	bullet3: '',
	bullet4: '',
	description: '',
	isValid: false,
	itemURL: '',
	manufacturerPartNumber: '',
	softwareLicenseType: '',
	standardProduct: false
}
