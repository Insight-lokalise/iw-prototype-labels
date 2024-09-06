import React, { Fragment } from 'react'
import cn from 'classnames'
import { connectToLocale } from '@insight/toolkit-react'
import { connect } from 'react-redux'

import Cart from '../../libs/businessContainerApps/cart/cart'
import Analytics from './components/analytics/Analytics'
import RecentlyViewedItems from './components/recommendations/recentlyViewedItems'
import RecommendedItems from './components/recommendations/recommendedItems'
import CartSummary from '../../libs/businessContainerApps/cartSummary/CartSummary'
import CartPrintHeader from './components/printPreview/CartPrintHeader'
import ShippingEstimator from './components/shippingEstimator/shippingEstimator'
import QuickShop from './components/quickShop/quickShop'
import UsageReporting from './components/usageReporting/UsageReporting'
import LegacyModals from './components/legacyModals/LegacyModals'
import CartMessages from './components/cartMessages/CartMessages'
import CheckoutButtonSection from './components/checkoutButton/CheckoutButtonSection'
import SaveForLater from '../../libs/businessContainerApps/saveForLater/SaveForLater'
import FavoriteAddressDropdown from '../../libs/businessContainerApps/favoriteAddressesDropdown/FavoriteAddressDropdown'
import CartSummarySimple from '../../libs/businessContainerApps/cartSummarySimple/CartSummarySimple'
import { selector_cart } from '../../libs/Cart/selectors'
import EmptyCartMessage from './components/emptyCart/EmptyCartMessage'
import {
  selector_hasQuickShopPermission,
  selector_isLoggedIn,
  selector_isDefaultLoggedOutUserEnabled,
  selector_isEMEA
} from '../../libs/User/selectors'

/**
 * There is a strange bug in the print view in IE/Edge where the CartSummary does
 * not display beyond the first page. We have hints that this is because of its
 * containing layout. <YASWANTH FILL IN>
 *
 * Because this component is not connected and this is a very one-off fix that we
 * do not want to encourge more uses of, we're isolating this logic here as best we can.
 * When this component or its parent becomes connected we can migrate this userAgent Logic
 * to some part of the state, like Insight or insightApplicationData and pull from there.
 * @type {Boolean}
 */
const isIE =
  window.navigator.userAgent.includes('MSIE ') ||
  !!window.navigator.userAgent.match(/Trident.*rv\:11\./)

export function ShoppingCart(props) {
  const { context, cartIsEmpty, hasQuickShopEnabled, isLoggedOutDefaultUser, isEMEA } =
    props
  const { isCES, locale } = context
  const  cartSummarySimpleProps = {
    isCartPage:true,
    showEstimateMessage:!isEMEA,
    showSaveForLater:true,
    hideCartOptions:isLoggedOutDefaultUser,
    showShippingHelpText:isEMEA,
    showTooltipForTax:isEMEA,
    isEMEA,
  }
  return (
    <div>
      <Analytics />
      <LegacyModals />
      <div className="row expanded small-collapse large-uncollapse">
        <div className="columns">
          <CartPrintHeader className="show-for-print hide-for-print-modal" />
          <CartMessages
            isCES={isCES}
            isLoggedOutDefaultUser={isLoggedOutDefaultUser}
          />
          <UsageReporting />
        </div>
      </div>
      <div className="row expanded small-collapse large-uncollapse">
        <div
          className={cn(
            'column print-cart-container cart-info small-12 print-12',
            {
              'large-12':
                (cartIsEmpty && isCES) ||
                (cartIsEmpty && isLoggedOutDefaultUser) ||
                (cartIsEmpty && !hasQuickShopEnabled),
            },
            { 'large-9': !cartIsEmpty || (!isCES && hasQuickShopEnabled) }
          )}
        >
          <div className="hide-for-medium">
            {!isCES && !isLoggedOutDefaultUser ? (
              <Fragment>
                {!cartIsEmpty && <FavoriteAddressDropdown type="shipping" />}
                <CartSummary
                  showTax
                  showShippingHelpText
                  showRequestorGroupDropdown
                  isCartPage
                >
                  <CheckoutButtonSection history={props.history} />
                </CartSummary>
              </Fragment>
            ) : (
              <CartSummarySimple {...cartSummarySimpleProps}>
                <CheckoutButtonSection
                  history={props.history}
                  isCES={isCES}
                  isLoggedOutDefaultUser={isLoggedOutDefaultUser}
                />
              </CartSummarySimple>
            )}
          </div>
          {cartIsEmpty && (
            <EmptyCartMessage
              isCES={isCES}
              locale={locale}
              isLoggedOutDefaultUser={isLoggedOutDefaultUser}
            />
          )}
          <Cart
            className="cart"
            history={props.history}
            isCartPage
            showReadOnlyLineLevels
            showReadOnlyDEPSection={false}
            hideLineLevelLink
            enableExpandCollapse
          />
          {!isCES && !isLoggedOutDefaultUser && (
            <Fragment>
              <div className="hide-for-medium">
                <SaveForLater />
              </div>
              <div className="hide-for-medium hide-for-print after-summary-section">
                {hasQuickShopEnabled && <QuickShop />}
                <ShippingEstimator />
              </div>
            </Fragment>
          )}
          {!cartIsEmpty && (
            <Fragment>
              <div className="hide-for-print">
                <RecommendedItems placementId="cart_page.rr1" />
              </div>
              <div className="hide-for-print">
                <RecentlyViewedItems />
              </div>
            </Fragment>
          )}

          {isIE && (
            <div className="hide print-show print-5 print-offset-7">
              {!isCES && !isLoggedOutDefaultUser ? (
                <CartSummary
                  showTax
                  showShippingHelpText
                  showRequestorGroupDropdown
                  isCartPage
                >
                  <CheckoutButtonSection history={props.history} />
                </CartSummary>
              ) : (
                <CartSummarySimple {...cartSummarySimpleProps}>
                  <CheckoutButtonSection
                    history={props.history}
                    isCES={isCES}
                    isLoggedOutDefaultUser={isLoggedOutDefaultUser}
                  />
                </CartSummarySimple>
              )}
            </div>
          )}
        </div>
        <div
          className={cn('summary-info small-12 large-3', {
            'hide-for-print': isIE,
            'print-5': !isIE,
            'print-offset-7': !isIE,
          })}
        >
          <div
            className={cn(
              'hide-for-small-only',
              {
                'top-space-large': !isCES && !isLoggedOutDefaultUser,
              },
              { 'sticky-summary': !cartIsEmpty }
            )}
          >
            {!isCES && !isLoggedOutDefaultUser ? (
              <Fragment>
                {!cartIsEmpty && <FavoriteAddressDropdown type="shipping" />}
                <CartSummary
                  showTax
                  showShippingHelpText
                  showRequestorGroupDropdown
                  isCartPage
                >
                  <CheckoutButtonSection history={props.history} />
                </CartSummary>
              </Fragment>
            ) : (
              <CartSummarySimple {...cartSummarySimpleProps}>
                <CheckoutButtonSection
                  history={props.history}
                  isCES={isCES}
                  isLoggedOutDefaultUser={isLoggedOutDefaultUser}
                />
              </CartSummarySimple>
            )}
            {!isCES && !isLoggedOutDefaultUser && (
              <Fragment>
                <div className="hide-for-print after-summary-section">
                  {hasQuickShopEnabled && <QuickShop />}
                  <ShippingEstimator />
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
      {cartIsEmpty && (
        <div className="row expanded cart-carousels">
          <div className="column small-12">
            <Fragment>
              <div className="hide-for-print">
                <RecommendedItems placementId="cart_page.rr1" />
              </div>
              <div className="hide-for-print">
                <RecentlyViewedItems />
              </div>
            </Fragment>
          </div>
        </div>
      )}
    </div>
  )
}

function mapStateToProps(state) {
  const cartIsEmpty = selector_cart(state).totalCount === 0
  const hasQuickShopPermission = selector_hasQuickShopPermission(state)
  const isLoggedIn = selector_isLoggedIn(state)
  return {
    cartIsEmpty,
    isLoggedIn,
    hasQuickShopEnabled: !isLoggedIn || (hasQuickShopPermission && isLoggedIn),
    isLoggedOutDefaultUser: selector_isDefaultLoggedOutUserEnabled(state),
    isEMEA: selector_isEMEA(state),
  }
}

export default connect(mapStateToProps, null)(connectToLocale(ShoppingCart))
