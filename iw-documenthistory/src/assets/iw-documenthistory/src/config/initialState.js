import {defaultFilters} from "../Orders/Search/constants/Constants";

/**
 * This file can be used as a top-level representation of redux state structure.
 * It can be helpful for a high level view when designing your state's structure.
 */
export default {
  insight: {
    ipsUser: false,
    locale: 'en_US',
  },
  orderSearch: {
    accountsByRegion: {},
    searchOrdersPagination: {},
    genericOrderHistoryResults: {},
    simpleSearchResults: {
      searchValues: {
        searchBy: 'purchaseNumber',
      },
    },
    simplifiedSearch: {
      isInit: true,
      query: defaultFilters,
    }
  },
  orderDetail: {
    order: {},
  },
}
