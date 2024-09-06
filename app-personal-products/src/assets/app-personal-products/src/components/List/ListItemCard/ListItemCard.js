import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import ProductDetails from './Details/Details'
import ProductListing from './Listing/Listing'
import ListItemCardActions from './ListItemCardActions'
import ListItemInventoryDetails from './ListItemInventoryDetails'

const baseDetailsClass = 'c-item-card__details o-grid__item u-1/1'

export default function ListItemCard({
	addToCompareProps,
	addToCartModal,
	approvedItem,
	availability,
	bullet1,
	bullet2,
	bullet3,
	bullet4,
  callForAvailability,
  callForPrice,
	closeModal,
	contract,
	displayDescriptionShort,
	dragHandleProps,
	goToCart,
	handleQuantityChange,
	hasCOI,
	hasCSI,
	hasReserved,
	id,
	isAddToCartClicked,
	isDragging,
	isDragDisabled,
	isLoading,
	isValid,
	isInventorySearchEnabled,
	isIPS,
	isPurchasingPopUpEnabled,
	isYourPriceLabel,
	manufacturerName,
	manufacturerPartNumber,
	materialId,
	modalIsOpen,
	price,
  proratable,
	productImage,
	quantity,
	removeItem,
	softwareLicenseType,
	standardProduct,
	getProductCompareHref
}) {
	const haszeroInventory = availability && availability.coi === 0 && availability.csi === 0 && availability.cai === 	0
	const showInventoryDetails = isInventorySearchEnabled && !haszeroInventory
  const detailsClass = showInventoryDetails ? `${baseDetailsClass} u-1/3@tablet` : `${baseDetailsClass} u-1/2@tablet`
  const imageURL = productImage && ( productImage.largeUrl || productImage.smallUrl )

	return (
		<div className={cn('c-item-card', { 'is-dragging': isDragging})}>
			<div className="o-grid c-item-card__grid">
				<ProductDetails
					addToCompareProps={addToCompareProps}
					approvedItem={approvedItem}
					bullet1={bullet1}
					bullet2={bullet2}
					bullet3={bullet3}
          bullet4={bullet4}
          callForAvailability={callForAvailability}
          callForPrice={callForPrice}
					description={displayDescriptionShort}
					detailsClass={detailsClass}
					dragHandleProps={dragHandleProps}
          isDragDisabled={isDragDisabled}
					isValid={isValid}
					imageURL={imageURL}
					manufacturerName={manufacturerName}
					manufacturerPartNumber={manufacturerPartNumber}
					materialId={materialId}
          proratable={proratable}
					softwareLicenseType={softwareLicenseType}
					standardProduct={standardProduct}
					getProductCompareHref={getProductCompareHref}
				/>
				{showInventoryDetails && (
					<ListItemInventoryDetails
						availability={availability}
						hasCOI={hasCOI}
						hasCSI={hasCSI}
						hasReserved={hasReserved}
					/>
				)}
				<ProductListing
					contract={contract}
          callForAvailability={callForAvailability}
          callForPrice={callForPrice}
					handleQuantityChange={handleQuantityChange}
					isIPS={isIPS}
					isValid={isValid}
					isYourPriceLabel={isYourPriceLabel}
					price={price}
					quantity={quantity}
					stock={availability && availability.stock}
          isUnlimitedStock={availability && availability.unlimited}
				/>
				<ListItemCardActions
					addToCartModal={addToCartModal}
          callForAvailability={callForAvailability}
          callForPrice={callForPrice}
					closeModal={closeModal}
					displayDescriptionShort={displayDescriptionShort}
					goToCart={goToCart}
					id={id}
					imageURL={imageURL}
					isAddToCartClicked={isAddToCartClicked}
					isLoading={isLoading}
					isPurchasingPopUpEnabled={isPurchasingPopUpEnabled}
					isValid={isValid}
					manufacturerPartNumber={manufacturerPartNumber}
					materialId={materialId}
					modalIsOpen={modalIsOpen}
					price={price}
					quantity={quantity}
					removeItem={removeItem}
				/>
			</div>
		</div>
	)
}

ListItemCard.propTypes = {
	addToCompareProps: PropTypes.shape({
		isSelectedToCompare: PropTypes.bool,
		needsCompareTo: PropTypes.bool,
		toggleSelectToCompare: PropTypes.func
	}),
	addToCartModal:PropTypes.func.isRequired,
	approvedItem: PropTypes.bool.isRequired,
	availability: PropTypes.shape({
		stock: PropTypes.number,
		coi: PropTypes.number,
		csi: PropTypes.number,
		reserved: PropTypes.number,
	}),
	bullet1: PropTypes.string,
	bullet2: PropTypes.string,
	bullet3: PropTypes.string,
  bullet4: PropTypes.string,
	closeModal: PropTypes.func.isRequired,
	contract: PropTypes.shape({
		abbreviation: PropTypes.string,
		description: PropTypes.string,
		extension: PropTypes.string,
		number: PropTypes.string,
	}),
	displayDescriptionShort: PropTypes.string,
	dragHandleProps: PropTypes.shape({
		/* key value pairs */
	}),
	goToCart: PropTypes.func.isRequired,
	handleQuantityChange: PropTypes.func.isRequired,
	hasCOI: PropTypes.bool.isRequired,
	hasCSI: PropTypes.bool.isRequired,
	hasReserved: PropTypes.bool.isRequired,
	id: PropTypes.string.isRequired,
	isAddToCartClicked: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  isDragDisabled: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	isIPS: PropTypes.bool.isRequired,
	isPurchasingPopUpEnabled: PropTypes.bool.isRequired,
	isValid: PropTypes.bool,
	isYourPriceLabel: PropTypes.bool,
	isInventorySearchEnabled: PropTypes.bool.isRequired,
	manufacturerName: PropTypes.string,
	manufacturerPartNumber: PropTypes.string,
	materialId: PropTypes.string.isRequired,
	modalIsOpen: PropTypes.bool.isRequired,
	productImage: PropTypes.shape({
		largeUrl:PropTypes.string,
    smallUrl: PropTypes.string,
	}),
	price: PropTypes.shape({
		currency: PropTypes.string,
		yourBestPrice: PropTypes.number,
		yourBestVatInclusivePrice: PropTypes.number,
	}),
	quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	removeItem: PropTypes.func.isRequired,
	softwareLicenseType: PropTypes.string,
	standardProduct: PropTypes.bool
}

ListItemCard.defaultProps ={
	availability: null,
	bullet1: '',
	bullet2: '',
	bullet3: '',
  bullet4: '',
	contract: {
    abbreviation: "",
    description: "",
    extension: "",
    number: "0"
  },
  displayDescriptionShort: '',
	isAddToCartClicked: false,
	isValid: false,
	isYourPriceLabel: false,
	manufacturerName: '',
	manufacturerPartNumber: '',
	price: null,
	productImage: null,
	softwareLicenseType: '',
	standardProduct: false
}
