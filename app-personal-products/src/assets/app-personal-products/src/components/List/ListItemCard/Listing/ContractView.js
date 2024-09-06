import React from 'react'
import PropTypes from 'prop-types'
import { Currency, TextEllipsis } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function ContractView({
	contract,
  callForPrice,
  callForAvailability,
	isIPS,
	isValid,
	isYourPriceLabel,
  price,
  isEMEA
}) {
	const isContractAvailable = contract && isIPS
	const contractDescription = contract.abbreviation || (isYourPriceLabel ? t('Your price') : t('OPEN MARKET'))
	const tooltip = { position: 'top' }
	const isProductAvailable = !callForPrice && !callForAvailability
	return (
		<div className="c-item-card__price o-grid__item u-text-center">
			<p className="c-item-card__price-label">{t('Unit Price')}</p>
			{isContractAvailable && isValid && (
				<div className="c-item-card__contract">
					<TextEllipsis length={20} tooltip={tooltip}>
						{contractDescription}
					</TextEllipsis>
				</div>
			)}
			{isValid && isProductAvailable && (
				<Currency
					currencyCode={price.currency}
          value={price.yourBestPrice}
          showVAT={isEMEA}
          tax={false}
				/>        
			)}
      {isValid && isProductAvailable && isEMEA && price.yourBestVatInclusivePrice != null && (
        <div>
          <Currency 
            currencyCode={price.currency} 
            value={price.yourBestVatInclusivePrice} 
						showVAT={isEMEA}
						tax={true} 
            highlight={true} />
          </div>
      )}
		</div>
	)
}

ContractView.propTypes = {
	contract: PropTypes.shape({
		abbreviation: PropTypes.string,
		description: PropTypes.string,
		extension: PropTypes.string,
		number: PropTypes.string
	}),
	isIPS: PropTypes.bool,
	isValid: PropTypes.bool,
	isYourPriceLabel: PropTypes.bool,
	price: PropTypes.shape({
		currency: PropTypes.string,
    yourBestPrice: PropTypes.number,
    yourBestVatInclusivePrice: PropTypes.number,
  }),
  isEMEA: PropTypes.bool.isRequired,
}

ContractView.defaultProps = {
	contract: {
		abbreviation: '',
		description: '',
		extension: '',
		number: '0'
	},
	isIPS: false,
	isValid: false,
	isYourPriceLabel: false,
	price: null
}
