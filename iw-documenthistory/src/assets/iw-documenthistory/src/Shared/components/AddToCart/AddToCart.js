import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connectToLocale } from "@insight/toolkit-react";
import { IWButton, IWModal } from '../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

import Quantity from './Quantity'
import StockStatus from './StockStatus'
import { addToCart } from '../../../Orders/Details/actions/addToCartActions'

export class AddToCart extends Component {
  constructor() {
    super()
    this.state = {
      clickedAddToCart: false,
      quantity: 1,
      showConfirmation: false,
    }
  }

  /**
   * Called when the quantity field changes. Only changes state if the value is
   * a valid number
   * @param  {SyntheticEvent} event representing the change
   */
  handleQtyChange = (event) => {
    const newQty = Number(event.target.value)
    const isNaN = newQty.toString() === 'NaN'
    if (!isNaN) {
      // successful coercion
      this.setState({ quantity: newQty })
    }
  }

  /**
   * Invoked when modal's confirm button has been clicked.
   * @return {?Promise} The return value of the onAddToCart callback, likely a promise
   */
  handleAddToCart = () => {
    const { context, item, getDEPInfo } = this.props
    const { locale, webGroupId } = context
    const { quantity } = this.state
    return addToCart({ ...item, quantity }, getDEPInfo, locale, webGroupId).then(() => {
      this.setState({ showConfirmation: true })
      setTimeout(() => {
        this.setState({ showConfirmation: false })
      }, 10000)
    })
  }

  openModal = () => {
    this.setState({ clickedAddToCart: true })
  }

  closeModal = () => {
    this.setState({ clickedAddToCart: false })
  }

  render() {
    const { quantity, clickedAddToCart, showConfirmation } = this.state
    const { canAddToCart, context, isBundle, item, nonShippable, stock } = this.props
    const { type, bundleType, description } = item
    const addToCartModalDesc = type === 'bundle' ? bundleType : description
    const isDisabled = !canAddToCart
    return (
      <div>
        <div className="row align-top add-to-cart">
          <div className="columns shrink text-center">
            <Quantity disabled={isDisabled} value={quantity || ''} onChange={this.handleQtyChange} />
            {!context.isCES && !isBundle && !nonShippable && <StockStatus stock={stock} />}
          </div>
          <div className="columns medium-shrink add-to-cart__btn-wrapper">
            <IWButton
              className="hollow small expanded add-to-cart__btn js-gtm-orders__add-to-cart"
              disabled={isDisabled}
              onClick={this.handleAddToCart}
            >
              {t('Add to cart')}
            </IWButton>
            {showConfirmation && (
              <div className="add-to-cart__confirmation">
                <span className="orders__ion-icon orders__ion-icon--left ion-checkmark-circled" />
                {t('Added to cart')}
              </div>
            )}
          </div>
        </div>
        <IWModal
          backdropClassName="iw-dialog iw-dialog-backdrop"
          cancelBtnText={'Cancel'}
          confirmBtnText={'Yes'}
          hideHeader
          hideHeaderCloseBtn
          modalSize="tiny"
          onConfirm={this.handleAddToCart}
          onHide={this.closeModal}
          showIf={clickedAddToCart}
        >
          <div className="columns">
            <h3 className="iw-modal__heading">{`Add ${addToCartModalDesc} to your cart?`}</h3>
          </div>
        </IWModal>
      </div>
    )
  }
}

AddToCart.propTypes = {
  canAddToCart: PropTypes.bool.isRequired,
  isBundle: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    bundleType: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string.isRequired,
    sapLineItemNumber: PropTypes.string,
  }).isRequired,
  nonShippable: PropTypes.bool,
  stock: PropTypes.number,
  getDEPInfo: PropTypes.func.isRequired,
}

AddToCart.defaultProps = {
  nonShippable: false
}
export default connectToLocale(AddToCart)
