import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import Contract from './Contract'
import Quantity from './Quantity'

export default function Listing({
	contract,
  callForAvailability,
  callForPrice,
	handleQuantityChange,
	isIPS,
	isValid,
	isYourPriceLabel,
	price,
	quantity,
	stock,
  isUnlimitedStock,
}) {
	return (
		<div className="o-grid__item">
			<div className="o-grid">
				<Contract
					contract={contract}
          callForAvailability={callForAvailability}
          callForPrice={callForPrice}
					isIPS={isIPS}
					isValid={isValid}
					isYourPriceLabel={isYourPriceLabel}
					price={price}
				/>
				{!isValid || callForAvailability || callForPrice
					? (
						<div className="c-item-card__quantity o-grid__item">
							<p className="c-item-card__quantity-label">{t('Qty')}</p>
							<div className="c-item-card__notAvailable-text">
								<span className="c-item-card__quantity-input">{t('Not available')}</span>
							</div>
						</div>
					)
					: (
						<Quantity
							handleQuantityChange={handleQuantityChange}
							quantity={quantity}
							stock={stock}
              isUnlimitedStock={isUnlimitedStock}
            />
					)
				}
			</div>
		</div>
	)
}

Listing.propTypes = {
	contract: PropTypes.shape({
		abbreviation: PropTypes.string,
		description: PropTypes.string,
		extension: PropTypes.string,
		number: PropTypes.string
	}),
	handleQuantityChange: PropTypes.func.isRequired,
	isIPS: PropTypes.bool,
	isValid: PropTypes.bool,
	price: PropTypes.shape({
		currency: PropTypes.string,
		yourBestPrice: PropTypes.number,
		yourBestVatInclusivePrice: PropTypes.number,
	}),
	quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	stock: PropTypes.number,
	isYourPriceLabel: PropTypes.bool,
  isUnlimitedStock: PropTypes.bool,
}

Listing.defaultProps = {
	contract: {
		abbreviation: '',
		description: '',
		extension: '',
		number: '0'
	},
	isIPS: false,
	isValid: false,
	isYourPriceLabel: false,
  isUnlimitedStock: false,
	price: null,
	stock: null,
}
