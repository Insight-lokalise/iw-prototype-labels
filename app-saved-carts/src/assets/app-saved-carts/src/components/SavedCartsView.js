import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { addToCart } from 'api'
import { getInObject } from '@insight/toolkit-utils'

import AddToCartModal from './AddToCartModal'
import DeleteCartModal from './DeleteCartModal'
import Header from './Header'
import NoSaves from './NoSaves'
import Section from './Section'

export default class SavedCartsView extends Component {
  constructor() {
    super()
    this.state = {
      addLoading: '',
      cartID: '',
      cartName: '',
      isAddToCartModalOpen: false,
      isAddToCartDone: true,
      isDeleteCartModalOpen: false,
      isDeleteCartDone: true,
    }
    this.closeModal = this.closeModal.bind(this)
    this.deleteCartConfirm = this.deleteCartConfirm.bind(this)
    this.goToCheckout = this.goToCheckout.bind(this)
    this.openAddToCartModal = this.openAddToCartModal.bind(this)
    this.openDeleteCartModal = this.openDeleteCartModal.bind(this)
  }

  closeModal() {
    this.setState({
      cartID: '',
      cartName: '',
      isAddToCartModalOpen: false,
      isAddToCartDone: true,
      isDeleteCartModalOpen: false,
      isDeleteCartDone: true,
      type: '',
    })
  }

  deleteCartConfirm() {
    const { cartID, type } = this.state
    const { deleteCart }= this.props
    this.setState({ isDeleteCartDone: false, type: '' })
    deleteCart(cartID, type).then(() => this.closeModal())
  }

  goToCheckout() {
    this.closeModal()
    window.location.assign('viewCart')
  }

  openAddToCartModal(cartName, cartID) {
    const { enablePurchasePopup } = this.props
    if (enablePurchasePopup) {
      addToCart(cartID).then(() => {
        this.setState({ isAddToCartDone: true })
        window.postMessage({ type: 'cart:add' }, window.location.origin)
      })
      this.setState({ cartID, cartName, isAddToCartModalOpen: true, isAddToCartDone: false })
    } else {
      this.setState({ addLoading: cartID }, () => addToCart(cartID).then(this.goToCheckout))
    }
  }

  openDeleteCartModal(cartName, cartID, type) {
    this.setState({ cartID, cartName, isDeleteCartModalOpen: true, isDeleteCartDone: true, type })
  }

  // Placeholders until loading and failed compnents are built
  render() {
    const {
      addLoading,
      cartName,
      isAddToCartDone,
      isAddToCartModalOpen,
      isDeleteCartDone,
      isDeleteCartModalOpen
    } = this.state
    const {hasFailed, isLoading, list, retrieveCart} = this.props
    const hasCarts =  getInObject(list, [ 'carts' ], []).length > 0
    const hasOrders = getInObject(list, [ 'orders' ], []).length > 0
    return (
      <div className="c-container  c-save-for-later">
        <Header />
        { hasCarts && (
          <Section
            addCart={this.openAddToCartModal}
            addLoading={addLoading}
            data={list.carts}
            deleteCart={this.openDeleteCartModal}
            retrieveCart={retrieveCart}
            type={'carts'}
          />
        )}
        { hasOrders && (
          <Section
            addCart={this.openAddToCartModal}
            addLoading={addLoading}
            data={list.orders}
            deleteCart={this.openDeleteCartModal}
            retrieveCart={retrieveCart}
            type={'orders'}
          />
        )}
        <NoSaves hasCarts={hasCarts} hasOrders={hasOrders} hasFailed={hasFailed} isLoading={isLoading} />
        { isAddToCartModalOpen && (
          <AddToCartModal
            cartName={cartName}
            closeModal={this.closeModal}
            goToCheckout={this.goToCheckout}
            isDone={isAddToCartDone}
            isModalOpen={isAddToCartModalOpen}
          />
        )}
        { isDeleteCartModalOpen && (
          <DeleteCartModal
            cartName={cartName}
            closeModal={this.closeModal}
            isDone={isDeleteCartDone}
            isModalOpen={isDeleteCartModalOpen}
            deleteCartConfirm={this.deleteCartConfirm}
          />
        )}
      </div>
    )
  }
}

SavedCartsView.propTypes = {
  deleteCart: PropTypes.func.isRequired,
  enablePurchasePopup: PropTypes.bool,
  hasFailed: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  list: PropTypes.shape({
    carts: PropTypes.array,
    orders: PropTypes.array,
  }),
  retrieveCart: PropTypes.func.isRequired,
}

SavedCartsView.defaultProps = {
  enablePurchasePopup: true,
  list: {}
}
