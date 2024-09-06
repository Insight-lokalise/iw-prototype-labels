import {
  TAB_REPORTING,
  TAB_ORDERS,
  TAB_LICENSING,
  TAB_NEWS,
  TAB_SEARCH,
  TAB_FAVORITES,
} from '../Dashboard/components/constants'

/**
 * This file can be used as a top-level representation of redux state structure.
 * It can be helpful when designing your state's structure and to notice shared
 * data.
 */
export default {
  /*
    user: {
      key: 'default state data here'
      isLoggedIn: false,
    }
  */
  approverRequisitions: null,
  requestorRequisitions: null,
  recentInvoices: null,
  recentOrders: null,
  recentQuotes: null,
  dashboard: {
    dashboardSettings: {
      currentTab: TAB_FAVORITES,
      tabs: {
        [TAB_FAVORITES]: {
          name: TAB_FAVORITES,
          dashlets: {
            news: true,
            recentInvoices: true,
            recentOrders: true,
            recentQuotes: true,
          },
          layouts: {
            lg: [
              {
                maxW: 2,
                static: false,
                minH: 2,
                minW: 1,
                w: 1,
                maxH: 2,
                moved: false,
                h: 2,
                x: 1,
                y: 2,
                i: 'Favorites_news',
              },
              {
                maxW: 2,
                static: false,
                minH: 2,
                minW: 1,
                w: 1,
                maxH: 2,
                moved: false,
                h: 2,
                x: 0,
                y: 2,
                i: 'Favorites_recentInvoices',
              },
              {
                maxW: 2,
                static: false,
                minH: 2,
                minW: 1,
                w: 1,
                maxH: 2,
                moved: false,
                h: 2,
                x: 0,
                y: 0,
                i: 'Favorites_recentOrders',
              },
              {
                maxW: 2,
                static: false,
                minH: 2,
                minW: 1,
                w: 1,
                maxH: 2,
                moved: false,
                h: 2,
                x: 1,
                y: 0,
                i: 'Favorites_recentQuotes',
              },
            ],
            xs: [
              {
                maxW: 2,
                static: false,
                minH: 2,
                minW: 1,
                w: 1,
                maxH: 2,
                moved: false,
                h: 2,
                x: 0,
                y: 6,
                i: 'Favorites_news',
              },
              {
                maxW: 2,
                static: false,
                minH: 2,
                minW: 1,
                w: 1,
                maxH: 2,
                moved: false,
                h: 2,
                x: 0,
                y: 4,
                i: 'Favorites_recentInvoices',
              },
              {
                maxW: 2,
                static: false,
                minH: 2,
                minW: 1,
                w: 1,
                maxH: 2,
                moved: false,
                h: 2,
                x: 0,
                y: 0,
                i: 'Favorites_recentOrders',
              },
              {
                maxW: 2,
                static: false,
                minH: 2,
                minW: 1,
                w: 1,
                maxH: 2,
                moved: false,
                h: 2,
                x: 0,
                y: 2,
                i: 'Favorites_recentQuotes',
              },
            ],
          },
        },
        [TAB_ORDERS]: { name: TAB_ORDERS, dashlets: {}, layouts: {} },
        [TAB_LICENSING]: { name: TAB_LICENSING, dashlets: {}, layouts: {} },
        [TAB_REPORTING]: { name: TAB_REPORTING, dashlets: {}, layouts: {} },
        [TAB_SEARCH]: { name: TAB_SEARCH, dashlets: {}, layouts: {} },
        [TAB_NEWS]: { name: TAB_NEWS, dashlets: {}, layouts: {} },
      },
    },
    availableDashlets: {
      'Orders': [],
      'Licensing & Renewals': [],
      'PowerBI': [],
      'News': [],
      'Reporting': [],
    },
    countries: {},
  },
  dashletSettings: {},
}
