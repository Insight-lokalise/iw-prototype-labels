import React, { useContext, useEffect, useState } from 'react'
import Badge from '@insight/toolkit-react/lib/Badge/Badge'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'
import listen from '@insight/toolkit-utils/lib/events/listen'
import { getItemCountFromShoppingRequest } from "@insight/toolkit-utils/lib/helpers/cartHelpers";
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import { t } from '@insight/toolkit-utils/lib/labels'
import { getCartItemCount } from 'api'
import {getCurrentLocale} from "@insight/toolkit-utils";
import { MASTHEAD_ICON_TITLES_CART } from '../../../api/common/constants'
import isCheckoutFlow from "../../../api/common/isCheckoutFlow";
import IAHeaderContext from "../../../context/IAHeaderContext";
import { INSIGHT_LOCALE_COOKIE_NAME } from "../../../api/common/locales";

export default function CartLink() {
  const isCheckoutRoute = isCheckoutFlow()
  const {
    headerInfo: { isLoggedIn, userInformation },
  } = useContext(IAHeaderContext)
  const locale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
  const [itemCount, setItemCount] = useState(0)
  const title = MASTHEAD_ICON_TITLES_CART
  const webGroupId = userInformation?.webGroup?.id
  const isShoppingReqWGEnabled = window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
  const isLoggedOutDefault = window?.flags['GNA-10394-SHOPPING-CART'] && !isLoggedIn && locale.split("_")[1] === 'US'
  const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, isLoggedOutDefault, isShoppingReqWGEnabled)

  useEffect(() => {
    refreshItemCount()
    return listen('cart', () => {
      refreshItemCount(true)
    })
  }, [])

  function getCartLink() {
    return isShoppingCartEnabled ? '/insightweb/cart': '/insightweb/viewCart'
  }

  function refreshItemCount(forceRefresh = false) {
    if(isShoppingCartEnabled && !isCheckoutRoute) {
      const numberOfItems = getItemCountFromShoppingRequest()
      setItemCount(numberOfItems)
    } else {
      getCartItemCount(forceRefresh).then(fetchedItemCount => {
        setItemCount(fetchedItemCount)
      })
    }

  }

  return (
    <li className='o-list-inline__item  c-header-simple-nav__item'>
      <Button href={getCartLink()} aria-label={`${t('Shopping cart,')} ${itemCount} ${t('items')}`}>
        <Icon icon="cart" title={t(title)}/>
        {itemCount > 0 && (
          <Badge color="primary" bold className="c-header-top__badge">
            {itemCount}
          </Badge>
        )}
      </Button>
    </li>
  )
}
