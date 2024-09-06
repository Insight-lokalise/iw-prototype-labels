import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import ListItemCardModal from './ListItemCardModal'
import ProductListing from "./Listing/Listing";

export default function ListItemCardActions({
	addToCartModal,
	closeModal,
  callForAvailability,
  callForPrice,
	displayDescriptionShort,
	goToCart,
	imageURL,
	isAddToCartClicked,
	isLoading,
	isPurchasingPopUpEnabled,
	isValid,
	manufacturerPartNumber,
	materialId,
	modalIsOpen,
	price,
	quantity,
	removeItem
}) {
	const buttonClassName = 'c-item-card__actions-button u-no-wrap'
	const showGoCart = !isPurchasingPopUpEnabled && isAddToCartClicked
	const showModal = !isLoading && modalIsOpen
  const isAddToCartDisabled = !isValid || callForAvailability || callForPrice
	return (
		<div className="c-item-card__actions o-grid__item u-1/1 u-1/4@tablet c-item-card__details-grid--shrink">
		  <Button onClick={removeItem} color="link" className={buttonClassName}>{t('Delete')}</Button>
			{showGoCart ? <Button onClick={goToCart} className={buttonClassName}>{t('Go to cart')}</Button>
				: <Button color="primary" size="small" onClick={addToCartModal} isDisabled={isAddToCartDisabled} className={buttonClassName} isLoading={isLoading}>{t('Add to cart')}</Button>
		  }
			{showModal &&
				<ListItemCardModal
						closeModal={closeModal}
						displayDescriptionShort={displayDescriptionShort}
						imageURL={imageURL}
						isValid={isValid}
						manufacturerPartNumber={manufacturerPartNumber}
						materialId={materialId}
						modalIsOpen={modalIsOpen}
						price={price}
						quantity={quantity}
					/>
			}
		</div>
	)
}

ListItemCardActions.propTypes = {
	addToCartModal:PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	displayDescriptionShort: PropTypes.string,
	goToCart:PropTypes.func.isRequired,
	imageURL: PropTypes.string,
	isAddToCartClicked: PropTypes.bool,
	isLoading: PropTypes.bool.isRequired,
	isPurchasingPopUpEnabled: PropTypes.bool.isRequired,
	isValid: PropTypes.bool,
	modalIsOpen: PropTypes.bool.isRequired,
	removeItem: PropTypes.func.isRequired,
}

ListItemCardActions.defaultProps ={
	displayDescriptionShort: '',
	imageURL: '',
	isAddToCartClicked: false,
	isValid: false,
}
