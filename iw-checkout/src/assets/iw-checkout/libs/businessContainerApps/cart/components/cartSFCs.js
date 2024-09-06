import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from '../../../iw-components'

const AddAccessoryLink = (props) => {
	return (
		<IWAnchor onClick={props.onClick} className="hide-for-print hide-for-email cart__table-row-accessories text-left">
			<span className="cart__table-col cart-item__add-accessory" tabindex="0" role="button">{t('Add accessories')}</span>
		</IWAnchor>
	)
}

const AddWarrantyLink = (props) => {
  return (
		<IWAnchor onClick={props.onClick} className="hide-for-print hide-for-email cart__table-row-accessories text-left">
			<span className="cart__table-col cart-item__add-warranty" tabindex="0" role="button">{props.isWarrantyAdded? t('Change protection') : t('Add protection')}</span>
		</IWAnchor>
	)
}

const ApprovedItem = (props) => {
	const approvedItem = 'Approved item'
	const addNegativeMargin = props.showProductImages ? `small-negative-left-margin` : 'hide-images-margin'
	const {origin} = document.location;
	const approvedIcon = props.isEmail ? (
		<img src={`${origin}/content/dam/insight-web/en_US/campaigns/generic/emailIcons/ico-check-blue.png`} />
	):(
		<span className="ion-checkmark-circled cart__approved-item-icon"> </span>
	)
	return (
		<div className={'cart__table-col cart-item__info text-left ' + addNegativeMargin}>
			<span className="cart__approved-item">
				{approvedIcon}
				{t(approvedItem)}
			</span>
		</div>
	)
}
ApprovedItem.propTypes = {
	isEmail: PropTypes.bool,
	showProductImages: PropTypes.bool.isRequired
}
ApprovedItem.defaultProps = {
	isEmail: false,
}

function CartItemTrashIcon(props) {
	function handleClick() {
		const itemDetails = { materialID: props.materialIDKey, contractID: props.contractID }
		return props.deleteFromCart(itemDetails, props.bundleHeader)
	}

	return (
		<span
			className="ion-trash-a cart__trash-icon"
            data-gtm-event = "cart-item-delete-click"
			title={t('Delete Cart Item')}
			role="button"
			tabIndex="0"
			onClick={handleClick}
			>
		</span>
	)
}

CartItemTrashIcon.propTypes = {
	bundleHeader: PropTypes.bool.isRequired,
	contractID: PropTypes.string.isRequired,
	deleteFromCart: PropTypes.func.isRequired,
	materialIDKey: PropTypes.string.isRequired
}

CartItemTrashIcon.defaultProps = {
	bundleHeader: false,
}

const StandardsProduct = (props) => {
	const companyStds = 'Company Standards'
	const addNegativeMargin = props.showProductImages ? `small-negative-left-margin` : 'hide-images-margin'
	const {origin} = document.location;
	const standardsIcon = props.isEmail ? (
		<img src={`${origin}/content/dam/insight-web/en_US/campaigns/generic/emailIcons/ico-pricetag.png`} />
	):(
		<span className="ion-ios-pricetag c-ion-ios-pricetag--purple"> </span>
	)
	return (
		<div className={'cart__table-col cart-item__info text-left ' + addNegativeMargin}>
			<span>
			{standardsIcon}
			{t(companyStds)}
			</span>
		</div>
	)
}
StandardsProduct.propTypes = {
	isEmail: PropTypes.bool,
	showProductImages: PropTypes.bool.isRequired
}
StandardsProduct.defaultProps = {
	isEmail: false,
}

const ContractHeader = (props) => {
	const contractText = 'Contract: '
    return (
		<div className="row expanded is-collapse-child">
			<div className="columns cart__contract-header">
				<div className="row row__gutter--tiny collapse">
					<div className="columns shrink">
						{t(contractText)}
					</div>
					<div className="columns">
						<strong>{props.contractName}</strong>
					</div>
				</div>
			</div>
		</div>
    )
}

const StockStatus = (props) => {
	const nonShippableText = 'non-shippable item'
	const stockText = 'Stock:'
	return props.nonShippable ?
		<div className="cart__stock-text cart__font-size--sm">{t(nonShippableText)}</div> :
		props.quantity <= props.stock ?
			<div className="ion-checkmark-circled cart__stock-icon cart__stock-icon--in-stock">
				<span className="cart__stock-text cart__font-size--sm">{t(stockText)} {props.stock}</span>
			</div>
			:
			<div className="ion-minus-circled cart__stock-icon cart__stock-icon--out-of-stock">
				<span className="cart__stock-text cart__font-size--sm">{t(stockText)} {props.stock}</span>
			</div>
}

export { AddAccessoryLink, AddWarrantyLink, ApprovedItem, CartItemTrashIcon, ContractHeader, StandardsProduct, StockStatus }
