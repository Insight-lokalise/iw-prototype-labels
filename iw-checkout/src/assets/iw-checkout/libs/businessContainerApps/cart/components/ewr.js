import React from 'react'
import PropTypes from 'prop-types'

import Currency from '@insight/toolkit-react/lib/Currency/Currency'
import { t } from '@insight/toolkit-utils/lib/labels'

const EWR = (props) => {
	const ewrText = t('Electronic Waste Recycling Fee')
	const { isCES, isStockAndPriceDisplayDisabled } = props
	return(<React.Fragment>{!isStockAndPriceDisplayDisabled?
		<div className="row expanded">			
			<div className='columns flex-child-auto text-left cart__table-col--ces-desc u-text-bold'>
			{ewrText}
			</div>

			{isCES ? (
				<div className="cart__table-col--qty-total small-negative-left-margin columns flex-child-auto medium-flex-child-shrink">
					<div className="align-justify row cart__table-col--qty-total__row">
					<div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--qty align-self-right u-text-bold">{props.quantity}</div>
					<div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--ces-total medium-text-right u-text-right">
						<Currency
							currencyCode={props.currencyCode}
							value={props.ewrFee}
						/>
						<div>
							(
							<Currency
								currencyCode={props.currencyCode}
								value={props.ewrFee / props.quantity}
							/>
							{` ${t('each')}`})
						</div>
					</div>
					</div>
				</div>
			) : (
				<>
					<Currency
						className={'columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--price medium-text-right align-self-right ' + (props.showProductImages ? '' : 'hide-images-margin__ewr')}
						value={props.ewrFee / props.quantity}
						currencyCode={props.currencyCode} />
					<div className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--qty align-self-right u-text-bold">{props.quantity}</div>
					<Currency className="columns flex-child-auto medium-flex-child-shrink cart__table-col cart__table-col--total medium-text-right align-self-right"
						value={props.ewrFee}
						currencyCode={props.currencyCode} />
				</>
			)}
		</div>:null}
		</React.Fragment>
	)
}

EWR.propTypes = {
	ewrFee: PropTypes.number,
	currencyCode: PropTypes.string.isRequired,
	quantity: PropTypes.number.isRequired,
	isStockAndPriceDisplayDisabled: PropTypes.bool,
	showProductImages: PropTypes.bool.isRequired,
}


export default EWR
