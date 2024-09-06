import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ListItemCard from '../ListItemCard/ListItemCard'
import { addToCart } from '../../../duck'
import { setCookie, updateCookie, getCookie } from '../../../lib'

const COMPARE_ITEMS_COOKIE_NAME = 'compare-items'

export default class ListItem extends Component {
  state = {
    isAddToCartClicked: false,
    isLoading: false,
    isSelectedToCompare: false,
    modalIsOpen: false,
    quantity: 1,
  }

  componentDidMount() {
    const { materialId } = this.props
    const compareItems = getCookie(COMPARE_ITEMS_COOKIE_NAME)
    const isItemAlreadyAvailableInCookie = compareItems!== '' && compareItems[materialId] && compareItems[materialId].materialId === materialId
    if(isItemAlreadyAvailableInCookie) this.toggleSelectToCompare(materialId)
  }

  addToCartModal = () => {
    const { isPurchasingPopUpEnabled, materialId, price: { source }, programID } = this.props
    const { quantity } = this.state
    this.setState({ isLoading: true, modalIsOpen: isPurchasingPopUpEnabled })
    return addToCart({ contractID: source, materialId, programID, quantity }).then(() => {
        this.setState({ isAddToCartClicked : true, isLoading: false })
    })
  }

  goToCart = () => {
    window.location = '/insightweb/viewCart'
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  removeItem = (id, materialId) => {
    const { isSelectedToCompare } = this.state
    if(isSelectedToCompare){
      this.toggleSelectToCompare(materialId)
    }
    this.props.removeFromPersonalProducts({id})
  }

  handleQuantityChange = (quantity) => {
    this.setState({ quantity })
  }

  toggleSelectToCompare = (itemId) => {
    const { isSelectedToCompare } = this.state
    const { updateCounter } = this.props
    isSelectedToCompare ? updateCounter(-1) : updateCounter(+1)
    AddOrRemoveItemsCompareItemsInCookie(itemId, isSelectedToCompare)
    this.setState(prevState => ({
      isSelectedToCompare: !prevState.isSelectedToCompare,
    }))
  }

  handleRender() {
    const { isAddToCartClicked, isLoading, isSelectedToCompare, modalIsOpen, quantity } = this.state
    const {
      displayDescriptionShort,
      hasCOI,
      hasCSI,
      hasReserved,
      id,
      isInventorySearchEnabled,
      isIPS,
      isPurchasingPopUpEnabled,
      isYourPriceLabel,
      materialId,
      productImage,
      selectedForCompareCount,
    } = this.props
    const addToCompareProps = {
      isSelectedToCompare,
      needsCompareTo: isSelectedToCompare && selectedForCompareCount < 2,
      toggleSelectToCompare: this.toggleSelectToCompare,
    }
    const getProductCompareHref = () => {
      const compareItems = getCookie(COMPARE_ITEMS_COOKIE_NAME)
      if(Object.keys(compareItems).length !== 0){
        const query = Object.keys(compareItems).reduce((cur,acc) => cur + '|' + acc)
        return `/insightweb/product-compare?q=${encodeURIComponent(query)}`
      }
    }
    const imageURL = productImage && ( productImage.largeUrl || productImage.smallUrl )

    return (
      <ListItemCard
        addToCompareProps={addToCompareProps}
        addToCartModal={this.addToCartModal}
        closeModal={this.closeModal}
        displayDescriptionShort={displayDescriptionShort}
        goToCart={this.goToCart}
        handleQuantityChange={this.handleQuantityChange}
        hasCOI={hasCOI}
        hasCSI={hasCSI}
        hasReserved={hasReserved}
        imageURL={imageURL}
        isAddToCartClicked={isAddToCartClicked}
        isLoading={isLoading}
        isInventorySearchEnabled={isInventorySearchEnabled}
        isYourPriceLabel={isYourPriceLabel}
        isIPS={isIPS}
        isPurchasingPopUpEnabled={isPurchasingPopUpEnabled}
        modalIsOpen={modalIsOpen}
        quantity={quantity}
        removeItem={()=>this.removeItem(id, materialId)}
        getProductCompareHref={getProductCompareHref}
        {...this.props}
      />
    )
  }

  render() {
    return this.handleRender()
  }
}

const AddOrRemoveItemsCompareItemsInCookie = (itemId, isRemove = false) => {
  let compareItems = getCookie(COMPARE_ITEMS_COOKIE_NAME)
  if(compareItems === '') compareItems = {}
  if(isRemove){
    if(itemId in compareItems){
      delete compareItems[itemId]
    }
  } else {
    compareItems[itemId] = {materialId: itemId}
  }
  updateCookie(COMPARE_ITEMS_COOKIE_NAME, () => setCookie(COMPARE_ITEMS_COOKIE_NAME, compareItems), compareItems)
}

ListItem.propTypes = {
  displayDescriptionShort: PropTypes.string,
  hasCOI: PropTypes.bool.isRequired,
	hasCSI: PropTypes.bool.isRequired,
	hasReserved: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  isInventorySearchEnabled: PropTypes.bool.isRequired,
  isIPS: PropTypes.bool.isRequired,
  isYourPriceLabel: PropTypes.bool,
	isValid: PropTypes.bool,
  isPurchasingPopUpEnabled: PropTypes.bool.isRequired,
  materialId: PropTypes.string.isRequired,
  price: PropTypes.shape({
    source: PropTypes.string,
  }),
  programID: PropTypes.string,
  productImage: PropTypes.shape({
    largeUrl: PropTypes.string,
    smallUrl: PropTypes.string,
  }),
  sequence: PropTypes.number.isRequired,
  selectedForCompareCount: PropTypes.number.isRequired,
  updateCounter: PropTypes.func.isRequired,
  removeFromPersonalProducts: PropTypes.func.isRequired,
}

ListItem.defaultProps ={
  displayDescriptionShort: '',
  isYourPriceLabel: false,
  isValid: false,
  price: null,
  productImage: null,
  programID: '',
}
