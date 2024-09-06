import { getHeaderInformation, TOOLS_MENU_TITLES } from '.'
import { getRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { REGION_CODE, INSIGHT_CURRENT_LOCALE_COOKIE_NAME  } from '../common/locales'

export default function getFixedToolsMenuItems() {
  return getHeaderInformation().then(headerInfo => {
    const { isLoggedIn, userInformation } = headerInfo
    const items = []

    // A favorite links section is only shown when logged in and enabled for the user.
    if (isLoggedIn && userInformation.permissions.enableFavorites) {
      items.push({
        type: 'favorite-links',
        title: TOOLS_MENU_TITLES.FAVORITES,
        favoriteLinks: userInformation.favoriteLinks,
        id: 'favorite-links-header'
      })
    }

    // 'Track an order' links to logged out order history for non-EMEA logged out user.
    if (!isLoggedIn && getRegion(INSIGHT_CURRENT_LOCALE_COOKIE_NAME) != REGION_CODE.EMEA) {
      items.push({
        type: 'order-tracking',
        className: 'js-gtm-order-tracking-link',
        href: '/insightweb/orderHistoryGeneric',
        title: TOOLS_MENU_TITLES.ORDER_TRACKING,
        id: 'order-tracking-link'
      })
    }
    // Only show 'Track an order' link if it's enabled for the logged in user.
    else if (userInformation.permissions.enableOrderHistory) {
      items.push({
        type: 'order-tracking',
        className: 'js-gtm-order-tracking-link',
        href: '/insightweb/orderHistory',
        title: TOOLS_MENU_TITLES.ORDER_TRACKING,
        id: 'order-tracking-link'
      })
    }

    return items
  })
}
