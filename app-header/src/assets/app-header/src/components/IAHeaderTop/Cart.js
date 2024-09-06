import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import Badge from '@insight/toolkit-react/lib/Badge/Badge'
import Header from '@insight/toolkit-react/lib/Header/Header'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'
import listen from '@insight/toolkit-utils/lib/events/listen'
import {getItemCountFromShoppingRequest} from '@insight/toolkit-utils/lib/helpers/cartHelpers'
import { MASTHEAD_ICON_TITLES_CART } from '../../api/common/constants'
import { getCartItemCount, t, isCheckoutFlow } from 'api'
import IAHeaderContext from "../../context/IAHeaderContext";


export default function Cart({ isMobile }) {
  const [itemCount, setItemCount] = useState(0)
  const title = MASTHEAD_ICON_TITLES_CART

  const {
    headerInfo: {
      locale,
      isCES,
      isLoggedIn,
      isIPSUser,
      isSEWPUser
    },
    userInformation
  } = useContext(IAHeaderContext)

  const webGroupId = userInformation?.webGroup?.id
  const localeArr = locale.split('_');
  const isLoggedOutUser = localeArr[1] === "US" && !isIPSUser && !isLoggedIn && !isSEWPUser
  const isShoppingCartEnabled = window?.flags['GNA-10394-SHOPPING-CART'];
  const isCartPageToRender =  isCES && (localeArr[1] === "US" || localeArr[1] === 'CA') &&
                              !isIPSUser && !isSEWPUser &&
                              isShoppingCartEnabled &&
                              window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
  const isShoppingCart = (isShoppingCartEnabled && isLoggedOutUser) || isCartPageToRender
  const isCheckoutRoutes = isCheckoutFlow() // once we move everything to shopping request on UI, we do not need to check for this routes
  const isHideLoggedoutPricingBySalesorg = !isLoggedIn && window?.flags['GNA-12455-HIDE-LOGGEDOUT-PRICING-BY-SALESORG'];

  useEffect(() => {
    refreshItemCount()
    return listen('cart', () => {
      refreshItemCount(true)
    })
  }, [])

  function refreshItemCount(forceRefresh = false) {
    if(isShoppingCart && !isCheckoutRoutes) {
      const numberOfItems = getItemCountFromShoppingRequest()
      setItemCount(numberOfItems)
    } else {
      getCartItemCount(forceRefresh).then(fetchedItemCount => {
        setItemCount(fetchedItemCount)
      })
    }

  }

  function getCartURL() {
    if (isHideLoggedoutPricingBySalesorg) {
      return '/insightweb/login';
    }
    return isShoppingCart ? '/insightweb/cart' : '/insightweb/viewCart'
  }

  return isMobile ? (
    <Header.Nav.Mobile.Item
      href={getCartURL()}
      aria-label={`Shopping cart, ${itemCount} items`}
      icon="cart"
      badge={itemCount > 0 && itemCount}
    >
      {'Cart'}
    </Header.Nav.Mobile.Item>
  ) : (
    <Header.Top.Item href={getCartURL()} aria-label={`Shopping cart, ${itemCount} items`} title={t(title)}>
      <Icon icon="cart" title={t(title)}/>
      {itemCount > 0 && (
        <Badge color="primary" bold className="c-header-top__badge">
          {itemCount}
        </Badge>
      )}
    </Header.Top.Item>
  )
}

Cart.propTypes = {
  isMobile: PropTypes.bool,
}

Cart.defaultProps = {
  isMobile: false,
}
