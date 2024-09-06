/* Routes */

export const PAGE_ROUTE = {
 ORDER_HISTORY :'/orderHistory',
 LOGGED_IN_ORDER_DETAILS :'/orderDetails/:orderNumber/:soldTo',
 LOGGED_OUT_ORDER_DETAILS :'/orderDetails',
 ORDER_TRACKING :'/orderHistoryGeneric'
}

export const ROUTES = {
  ORDER_HISTORY: {
    url: PAGE_ROUTE.ORDER_HISTORY,
    name: 'Orders'
  },
  LOGGED_IN_ORDER_DETAILS: {
    url: PAGE_ROUTE.LOGGED_IN_ORDER_DETAILS,
    name: 'Order details'
  },
  LOGGED_OUT_ORDER_DETAILS: {
    url: PAGE_ROUTE.LOGGED_OUT_ORDER_DETAILS,
    name: 'Order details'
  },
  ORDER_TRACKING: {
    url: PAGE_ROUTE.ORDER_TRACKING,
    name: 'Orders'
  }
}

export const BREADCRUMBS = {
  ORDER_HISTORY: [
    ROUTES.ORDER_HISTORY
  ],
  LOGGED_IN_ORDER_DETAILS: [
    ROUTES.ORDER_HISTORY,
    ROUTES.LOGGED_IN_ORDER_DETAILS
  ],
  LOGGED_OUT_ORDER_DETAILS: [
    ROUTES.ORDER_TRACKING,
    ROUTES.LOGGED_OUT_ORDER_DETAILS
  ],
  ORDER_TRACKING: [
    ROUTES.ORDER_TRACKING,
  ]
}
