import React, { Component } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

import { connectToLocale, Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { toggleProductImage } from '../../../models/Cart'
import { IWLoading } from '../../../iw-components'
import { connect } from 'react-redux'
import { selector_isDefaultLoggedOutUserEnabled } from '../../../../libs/User/selectors/index'

import CartList from './cartList'
import CartHeader from './cartHeader'
import CartFooter from './cartFooter'

export class CartView extends Component {
  componentDidMount() {
    if (this.props.isCartPage && this.props.cart && this.props.cart.cloudCart) {
      window.location = '/insightweb/shippingOrder'
    }
  }

  showNumberOfItemsInCart = () => {
    const { numberOfItemsInCart, numberOfLineLevelForms } = this.props

    const itemText = ` ${t(
      numberOfItemsInCart === 1
        ? 'line item requires information'
        : 'line items require information'
    )}`

    return (
      <span className="columns shrink section__header-text">
        {numberOfLineLevelForms + itemText}
      </span>
    )
  }

  toggleProductImages = () => {
    const { showProductImages, userInformation } = this.props
    return toggleProductImage(!showProductImages).then(() => {
      userInformation()
    })
  }
  render() {
    const headerText = this.props.showLineLevelForm
      ? t('Item information')
      : this.props.context.isCES || this.props.isLoggedOutDefaultUser
      ? t('Cart')
      : t('Your cart')

    return (
      this.props.cart.totalCount > 0 && (
        <section
          className={cn('cart', this.props.className)}
          aria-label={headerText}
        >
          {this.props.cart.isPending && (
            <IWLoading modal className="iw-loading__size-giant" />
          )}

          <CartHeader
            cart={this.props.cart}
            cartItemTentativeQuantities={this.props.cartItemTentativeQuantities}
            emptyCart={this.props.emptyCart.bind(this)}
            hasUserPreferences={this.props.hasUserPreferences}
            headerText={headerText}
            isCartPage={this.props.isCartPage}
            isB2BUser={this.props.isB2BUser}
            isReadOnly={this.props.isReadOnly}
            showLineLevelForm={this.props.showLineLevelForm}
            showProductImages={this.props.showProductImages}
            toggleProductImages={this.toggleProductImages.bind(this)}
            updateCartItemQuantities={this.props.updateCartItemQuantities.bind(
              this
            )}
            isCES={this.props.context.isCES}
            isLoggedOutDefaultUser={this.props.isLoggedOutDefaultUser}
          />

          <CartList
            b2bCartTransferCommoditiesMap={
              this.props.b2bCartTransferCommoditiesMap
            }
            b2bUnspscCode={this.props.b2bUnspscCode}
            cart={this.props.cart}
            isCartPage={this.props.isCartPage}
            defaultContactInformation={this.props.defaultContactInformation}
            defaultCountryOfUsage={this.props.defaultCountryOfUsage}
            disableDEPLink={this.props.disableDEPLink}
            disableLineLevelLink={this.props.disableLineLevelLink}
            enableExpandCollapse={this.props.enableExpandCollapse}
            getCart={this.props.getCart}
            hideLineLevelLink={this.props.hideLineLevelLink}
            hasMultipleLicenseInfoForms={this.props.hasMultipleLicenseInfoForms}
            hasLineLevelsInfoPopulated={this.props.hasLineLevelsInfoPopulated}
            hasUserPreferences={this.props.hasUserPreferences}
            history={this.props.history}
            setActiveIndex={this.props.setActiveIndex}
            isStockAndPriceDisplayDisabled={
              this.props.isStockAndPriceDisplayDisabled
            }
            isB2BUser={this.props.isB2BUser}
            isB2BTransfer={this.props.isB2BTransfer}
            ipsUser={this.props.ipsUser}
            isLoggedIn={this.props.isLoggedIn}
            isReadOnly={!!this.props.isReadOnly}
            isCloudCart={this.props.isCloudCart}
            lineLevelFormNames={this.props.lineLevelFormNames}
            locale={this.props.locale}
            numberOfItemsInCart={this.props.numberOfItemsInCart}
            showBottomBorder={this.props.show}
            showReadOnlyLineLevels={this.props.showReadOnlyLineLevels}
            showReadOnlyDEPSection={this.props.showReadOnlyDEPSection}
            showLineLevelForm={this.props.showLineLevelForm}
            showProductImages={this.props.showProductImages}
            splitItems={this.props.splitItems}
            // actions
            addToReadOnlyFieldsMap={this.props.addToReadOnlyFieldsMap}
            deleteFromCart={this.props.deleteFromCart}
            updateItemQuantity={this.props.updateItemQuantity}
            saveProrationUsageDate={this.props.saveProrationUsageDate}
            updateCartItemQuantities={this.props.updateCartItemQuantities}
            updateChildItems={this.props.updateChildItems}
          />

          {!this.props.context.isCES &&
            !this.props.isLoggedOutDefaultUser &&
            this.props.isCartPage && (
              <CartHeader
                cart={this.props.cart}
                cartItemTentativeQuantities={
                  this.props.cartItemTentativeQuantities
                }
                emptyCart={this.props.emptyCart.bind(this)}
                hasUserPreferences={this.props.hasUserPreferences}
                isCartPage={this.props.isCartPage}
                isReadOnly={this.props.isReadOnly}
                showLineLevelForm={this.props.showLineLevelForm}
                showProductImages={this.props.showProductImages}
                toggleProductImages={this.toggleProductImages.bind(this)}
                updateCartItemQuantities={this.props.updateCartItemQuantities.bind(
                  this
                )}
                isCES={this.props.context.isCES}
                isLoggedOutDefaultUser={this.props.isLoggedOutDefaultUser}
              />
            )}

          {this.props.showLineLevelForm && <CartFooter />}
        </section>
      )
    )
  }
}

CartView.propTypes = {
  cart: PropTypes.object.isRequired,
  enableExpandCollapse: PropTypes.bool,
  hasMultipleLicenseInfoForms: PropTypes.bool.isRequired,
  hasLineLevelsInfoPopulated: PropTypes.bool.isRequired,
  hasUserPreferences: PropTypes.bool.isRequired,
  hideLineLevelLink: PropTypes.bool,
  history: PropTypes.object,
  isB2BUser: PropTypes.bool,
  isB2BTransfer: PropTypes.bool,
  isCartPage: PropTypes.bool,
  isCloudCart: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isStockAndPriceDisplayDisabled: PropTypes.bool,
  lineLevelFormNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  numberOfItemsInCart: PropTypes.number.isRequired,
  numberOfLineLevelForms: PropTypes.number.isRequired,
  showLineLevelForm: PropTypes.bool,
  showProductImages: PropTypes.bool.isRequired,
  showReadOnlyLineLevels: PropTypes.bool,
  showReadOnlyDEPSection: PropTypes.bool,
  setActiveIndex: PropTypes.func.isRequired,
  splitItems: PropTypes.func.isRequired,
  updateChildItems: PropTypes.func.isRequired,
  isCES: PropTypes.bool,
  isLoggedOutDefaultUser: PropTypes.bool,
}

CartView.defaultProps = {
  disableDEPLink: false,
  disableLineLevelLink: false,
  enableExpandCollapse: false,
  hideLineLevelLink: false,
  isB2BTransfer: false,
  isCartPage: false,
}

function mapStateToProps(state) {
  return {
    isLoggedOutDefaultUser: selector_isDefaultLoggedOutUserEnabled(state),
  }
}

export default connect(mapStateToProps, null)(connectToLocale(CartView))
