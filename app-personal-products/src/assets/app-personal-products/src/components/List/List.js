import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DraggableList from './DraggableList/DraggableList'
import ListHeader from './ListHeader'
import ListItem from './ListItem/ListItem'

export default class List extends Component {
  state = {
    selectedForCompareCount: 0,
  }

  onDragEnd = ({ destination, source }) => {
    if (!destination) {
      return
    }
    if (source.index !== destination.index) {
      this.props.updateFavoritesOrder(source.index, destination.index)
    }
  }

  updateCounter = (amount) => {
    this.setState((prevState) => ({
      selectedForCompareCount: prevState.selectedForCompareCount + amount,
    }))
  }

  renderFavoriteItems() {
    const {
      isBestPriceAvailable,
      isCOIAvailable,
      isCSIAvailable,
      isReservedAvailable,
      isInventorySearchEnabled,
      isPurchasingPopUpEnabled,
      isYourPriceLabel,
      isIPS,
      productsList,
      removeFromPersonalProducts,
    } = this.props
    const { selectedForCompareCount } = this.state
    const isDragDisabled = productsList.length < 2
    return productsList.map((item, index) => {
      const draggableId = item.sequence.toString()
      return (
        <DraggableList.Item
          {...{ isDragDisabled, draggableId, index }}
          key={item.id}
        >
          <ListItem
            isBestPriceAvailable={isBestPriceAvailable}
            isCOIAvailable={isCOIAvailable}
            isCSIAvailable={isCSIAvailable}
            isReservedAvailable={isReservedAvailable}
            isIPS={isIPS}
            isInventorySearchEnabled={isInventorySearchEnabled}
            isPurchasingPopUpEnabled={isPurchasingPopUpEnabled}
            isYourPriceLabel={isYourPriceLabel}
            hasBestPrice={item.hasBestPrice}
            hasCOI={item.hasCOI}
            hasCSI={item.hasCSI}
            hasReserved={item.hasReserved}
            selectedForCompareCount={selectedForCompareCount}
            updateCounter={this.updateCounter}
            removeFromPersonalProducts={removeFromPersonalProducts}
            {...item}
          />
        </DraggableList.Item>
      )
    })
  }

  render() {
    const {
      isAllValid,
      isBestPriceAvailable,
      isCOIAvailable,
      isCSIAvailable,
      isInventorySearchEnabled,
      isReservedAvailable,
      productsList,
    } = this.props
    return (
      <div className="c-list">
        <ListHeader
          hasBestPrice={productsList.hasBestPrice}
          hasCOI={productsList.hasCOI}
          hasCSI={productsList.hasCSI}
          hasReserved={productsList.hasReserved}
          isBestPriceAvailable={isBestPriceAvailable}
          isCOIAvailable={isCOIAvailable}
          isCSIAvailable={isCSIAvailable}
          isReservedAvailable={isReservedAvailable}
          isAllValid={isAllValid}
          isInventorySearchEnabled={isInventorySearchEnabled}
        />
        <DraggableList droppableId="favorites-list" onDragEnd={this.onDragEnd}>
          {this.renderFavoriteItems()}
        </DraggableList>
      </div>
    )
  }
}

List.propTypes = {
  isAllValid: PropTypes.bool.isRequired,
  isBestPriceAvailable: PropTypes.bool.isRequired,
  isCOIAvailable: PropTypes.bool.isRequired,
  isCSIAvailable: PropTypes.bool.isRequired,
  isReservedAvailable: PropTypes.bool.isRequired,
  isInventorySearchEnabled: PropTypes.bool.isRequired,
  isIPS: PropTypes.bool.isRequired,
  isPurchasingPopUpEnabled: PropTypes.bool.isRequired,
  isYourPriceLabel: PropTypes.bool,
  productsList: PropTypes.arrayOf(
    PropTypes.shape({
      hasBestPrice: PropTypes.bool.isRequired,
      hasCOI: PropTypes.bool.isRequired,
      hasCSI: PropTypes.bool.isRequired,
      hasReserved: PropTypes.bool.isRequired,
      sequence: PropTypes.number.isRequired,
    })
  ).isRequired,
  removeFromPersonalProducts: PropTypes.func.isRequired,
  updateFavoritesOrder: PropTypes.func.isRequired,
}

List.defaultProps = {
  isYourPriceLabel: false,
}
